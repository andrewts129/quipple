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
import { Player } from '../player/player.model';
import { StartRequestDto } from './dto/incoming/StartRequestDto';
import { QuestionService } from '../question/question.service';
import { NewQuestionDto } from './dto/outgoing/NewQuestionDto';
import { SubmitAnswerDto } from './dto/incoming/SubmitAnswerDto';

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

    private registrations: Map<Socket, [Game, string]> = new Map();

    @SubscribeMessage('register')
    async handleRegister(client: Socket, data: RegisterDto): Promise<void> {
        const game = await this.gameService.findGame(data.gameId);
        const player = this.authService.decodeJwt(data.jwt);
        if (game && player) {
            if (this.gameService.playerInGame(game, player)) {
                await this.updateClientPlayerLists(game);
                client.join(game.id);
                this.registrations.set(client, [game, data.jwt]);
            } else {
                throw new WsException('Unauthorized');
            }
        } else {
            throw new WsException(`Game with ID ${data.gameId} not found`);
        }
    }

    @SubscribeMessage('start')
    async handleStart(client: Socket, data: StartRequestDto): Promise<void> {
        const [game, player] = this.getRegistration(client, data.jwt);
        if (player.id === game.owner.id) {
            game.state = 'question' as const;
            this.server.to(game.id).emit('start');
            this.sendNewQuestion(game);
        } else {
            throw new WsException('Unauthorized');
        }
    }

    @SubscribeMessage('submitAnswer')
    async handleSubmitAnswer(client: Socket, data: SubmitAnswerDto): Promise<void> {
        const [game, player] = this.getRegistration(client, data.jwt);
        if (game.state === 'question') {
            // TODO actually do something with the answer
            console.log(`Answer from ${player.screenName}: ${data.answer}`);
        } else {
            throw new WsException('Wrong state');
        }
    }

    async handleDisconnect(client: Socket): Promise<void> {
        const [game, player] = this.getRegistration(client);
        await this.gameService.removePlayer(game, player);
        await this.updateClientPlayerLists(game);
    }

    async updateClientPlayerLists(game: Game): Promise<void> {
        this.server.to(game.id).emit('newPlayerList', {
            owner: game.owner,
            players: game.players
        } as PlayerListDto);
    }

    async sendNewQuestion(game: Game): Promise<void> {
        const question = await this.questionService.randomQuestion();
        this.server.to(game.id).emit('newQuestion', { question } as NewQuestionDto);
    }

    getRegistration(client: Socket, receivedJwt?: string): [Game, Player] {
        const [game, storedJwt] = this.registrations.get(client);
        if (!game || !storedJwt) {
            throw new WsException('Not registered');
        } else if (receivedJwt && receivedJwt !== storedJwt) {
            throw new WsException('Authorization not valid');
        } else {
            const player = this.authService.decodeJwt(storedJwt);
            return [game, player];
        }
    }
}
