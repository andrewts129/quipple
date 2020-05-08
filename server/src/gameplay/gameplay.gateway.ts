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
import { SubmitAnswerDto } from './dto/incoming/SubmitAnswerDto';
import { StartGameDto } from './dto/outgoing/StartGameDto';

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
                client.join(game.id);
                this.registrations.set(client, [game, data.jwt]);
                this.updateClientPlayerLists(game);
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
        if (player.id === game.owner.id && game.id === data.gameId) {
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

    @SubscribeMessage('submitAnswer')
    async handleSubmitAnswer(client: Socket, data: SubmitAnswerDto): Promise<void> {
        const [game, player] = this.getRegistration(client, data.jwt);
        if (game.stage === 'question') {
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
