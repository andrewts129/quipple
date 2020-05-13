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
import { QuestionService } from '../question/question.service';
import { SubmitAnswerDto } from './dto/incoming/SubmitAnswerDto';
import { StartGameDto } from './dto/outgoing/StartGameDto';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { WsAuthGuard, AuthenticatedData } from '../auth/ws.auth.guard';
import { Game } from '../game/game.entity';

@WebSocketGateway({ namespace: 'gameplay' })
export class GameplayGateway {
    constructor(
        private gameService: GameService,
        private questionService: QuestionService,
        private authService: AuthService
    ) {}

    @WebSocketServer()
    private server: Server;

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('register')
    async handleRegister(client: Socket, data: RegisterDto & AuthenticatedData): Promise<void> {
        const game = await this.findGame(data.gameId);
        if (this.gameService.playerInGame(game.id, data.player.id)) {
            client.join(game.id);
            this.updateClientPlayerLists(game.id);

            client.on('disconnecting', () => this.handleClientDisconnect(client));
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
            const questions = await this.questionService.randomQuestions(3);
            this.server.to(game.id).emit('start', { questions } as StartGameDto);

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
            // TODO actually do something with the answer
            console.log(`Answer from ${data.player.screenName}: ${data.answer}`);
        } else {
            throw new WsException('Not accepting questions');
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

    private async handleClientDisconnect(client: Socket): Promise<void> {
        const jwt = client.handshake.query?.jwt;
        const gameId = this.getRoom(client);
        if (jwt && gameId) {
            try {
                const game = await this.gameService.findGame(gameId);
                const player = this.authService.decodeJwt(jwt);
                await this.gameService.removePlayer(game.id, player.id);
                this.updateClientPlayerLists(game.id);
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
