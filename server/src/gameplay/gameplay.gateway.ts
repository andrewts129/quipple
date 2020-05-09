import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayDisconnect,
    WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RegisterDto } from './dto/incoming/RegisterDto';
import { GameService } from '../game/game.service';
import { Game } from '../game/game.model';
import { PlayerListDto } from './dto/outgoing/PlayerListDto';
import { AuthService } from '../auth/auth.service';
import { QuestionService } from '../question/question.service';
import { SubmitAnswerDto } from './dto/incoming/SubmitAnswerDto';
import { StartGameDto } from './dto/outgoing/StartGameDto';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard, AuthenticatedData } from '../auth/ws.auth.guard';

// TODO validation
@WebSocketGateway({ namespace: 'gameplay' })
export class GameplayGateway implements OnGatewayDisconnect {
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
        const game = await this.gameService.findGame(data.gameId);
        if (game) {
            if (this.gameService.playerInGame(game, data.player)) {
                client.join(game.id);
                this.updateClientPlayerLists(game);
            } else {
                throw new WsException('Unauthorized');
            }
        } else {
            throw new WsException(`Game with ID ${data.gameId} not found`);
        }
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('start')
    async handleStart(client: Socket, data: AuthenticatedData): Promise<void> {
        const gameId = this.getRoom(client);
        const game = await this.gameService.findGame(gameId);
        if (data.player.id === game.owner.id && game.id === gameId) {
            const questions = await this.questionService.randomQuestions(3);
            this.server.to(game.id).emit('start', { questions } as StartGameDto);

            game.stage = 'starting' as const;
            setTimeout(() => {
                game.stage = 'question' as const;
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
        const game = await this.gameService.findGame(gameId);
        if (game.stage === 'question') {
            // TODO actually do something with the answer
            console.log(`Answer from ${data.player.screenName}: ${data.answer}`);
        } else {
            throw new WsException('Wrong state');
        }
    }

    async handleDisconnect(client: Socket): Promise<void> {
        console.log(client.handshake.query?.jwt);
        // const [game, player] = this.getRegistration(client);
        // if (game || player) {
        //     this.removeRegistration(client);

        //     await this.gameService.removePlayer(game, player);
        //     if (!(await this.gameService.gameEmpty(game))) {
        //         this.updateClientPlayerLists(game);
        //     }
        // }
    }

    async updateClientPlayerLists(game: Game): Promise<void> {
        this.server.to(game.id).emit('newPlayerList', {
            owner: game.owner,
            players: game.players
        } as PlayerListDto);
    }

    private getRoom(client: Socket): string | undefined {
        const rooms = Object.keys(client.rooms);
        return rooms.find((room) => /^[A-Z]{5}$/.test(room));
    }
}
