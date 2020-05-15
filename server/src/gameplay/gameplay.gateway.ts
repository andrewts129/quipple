import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RegisterDto } from './dto/incoming/RegisterDto';
import { GameService } from '../game/game.service';
import { PlayerListDto } from './dto/outgoing/PlayerListDto';
import { AuthService } from '../auth/auth.service';
import { SubmitAnswerDto } from './dto/incoming/SubmitAnswerDto';
import { RegisterResponseDto } from './dto/outgoing/RegisterResponseDto';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { WsAuthGuard, AuthenticatedData } from '../auth/ws.auth.guard';
import { Game } from '../game/game.entity';
import { NewAnswerDto } from './dto/outgoing/NewAnswerDto';
import { VoteDto } from './dto/incoming/VoteDto';
import { VoteService } from '../vote/vote.service';
import { Vote } from '../vote/vote.entity';
import { VotingResultsDto } from './dto/outgoing/VotingResultsDto';

@WebSocketGateway({ namespace: 'gameplay' })
export class GameplayGateway {
    constructor(
        private gameService: GameService,
        private authService: AuthService,
        private voteService: VoteService
    ) {}

    @WebSocketServer()
    private server: Server;

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('register')
    async handleRegister(
        client: Socket,
        data: RegisterDto & AuthenticatedData
    ): Promise<RegisterResponseDto> {
        const game = await this.findGame(data.gameId);
        if (this.gameService.playerInGame(game.id, data.player.id)) {
            client.join(game.id);
            this.updateClientPlayerLists(game.id);

            client.on('disconnecting', () => this.handleClientDisconnect(client));

            return {
                questions: game.questions
            };
        } else {
            throw new WsException('Unauthorized');
        }
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('start')
    async handleStart(client: Socket, data: AuthenticatedData): Promise<void> {
        const gameId = this.getRoom(client);
        const game = await this.findGame(gameId);
        if (data.player.id === game.owner.id) {
            this.server.to(game.id).emit('start');

            await this.gameService.changeStage(game.id, 'starting');
            setTimeout(() => {
                this.gameService.changeStage(game.id, 'question');
            }, 3000);
        } else {
            throw new WsException('Unauthorized');
        }
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('submitAnswer')
    async handleSubmitAnswer(
        client: Socket,
        data: SubmitAnswerDto & AuthenticatedData
    ): Promise<void> {
        const gameId = this.getRoom(client);
        const game = await this.findGame(gameId);
        if (game.stage === 'question') {
            this.server.to(game.id).emit('newAnswer', {
                answer: data.answer,
                player: data.player
            } as NewAnswerDto);
        } else {
            throw new WsException('Not accepting answers');
        }
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('vote')
    async handleVote(client: Socket, data: VoteDto & AuthenticatedData): Promise<void> {
        const gameId = this.getRoom(client);
        const game = await this.gameService.findGame(gameId);

        if (game.stage === 'question') {
            this.gameService.changeStage(game.id, 'voting');
        } else if (game.stage !== 'voting') {
            throw new WsException('Wrong stage');
        }

        // Stage is now 'voting'
        await this.voteService.saveVote(game.id, data.forPlayerId);

        const votes = await this.voteService.getVotes(game.id);
        if (votes.length >= game.players.length + 1) {
            this.handleAllVotesIn(game.id, votes);
        }
    }

    async updateClientPlayerLists(gameId: string): Promise<void> {
        const game = await this.gameService.findGame(gameId);
        if (game) {
            this.server.to(game.id).emit('newPlayerList', {
                owner: game.owner,
                players: game.players
            } as PlayerListDto);
        }
    }

    // Wraps the `GameService.findGame` function with a websocket friendly exception on failure
    private async findGame(gameId: string): Promise<Game> {
        try {
            return this.gameService.findGame(gameId);
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new WsException(e.message);
            } else {
                console.log(e);
                throw new WsException('Unexpected server error');
            }
        }
    }

    private async handleAllVotesIn(gameId: string, votes: Vote[]): Promise<void> {
        this.server.to(gameId).emit('votingResults', {
            votes: votes.map((v) => v.forPlayerId)
        } as VotingResultsDto);

        this.voteService.clearVotes(gameId);
    }

    private async handleClientDisconnect(client: Socket): Promise<void> {
        const jwt = client.handshake.query?.jwt;
        const gameId = this.getRoom(client);
        if (jwt && gameId) {
            try {
                const game = await this.gameService.findGame(gameId);
                const player = this.authService.decodeJwt(jwt);
                const updatedGame = await this.gameService.removePlayer(game.id, player.id);

                // If the game came back deleted, it's out of players, so don't bother with the update
                if (updatedGame?.id) {
                    this.updateClientPlayerLists(game.id);
                }
            } catch (e) {
                // Swallow NotFoundExceptions - if the game doesn't exist, that's fine, just do nothing
                if (!(e instanceof NotFoundException)) {
                    throw e;
                }
            }
        }
    }

    private getRoom(client: Socket): string | undefined {
        const rooms = Object.keys(client.rooms);
        return rooms.find((room) => /^[A-Z]{5}$/.test(room));
    }
}
