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
import { Player } from '../player/player.model';
import { AuthService } from '../auth/auth.service';

// TODO validation & auth
@WebSocketGateway({ namespace: 'gameplay' })
export class GameplayGateway implements OnGatewayDisconnect {
    constructor(private gameService: GameService, private authService: AuthService) {}

    @WebSocketServer()
    private server: Server;

    private clientPlayerGameMapping: Map<Socket, [Game, Player]> = new Map();

    @SubscribeMessage('register')
    async handleRegister(client: Socket, request: RegisterDto): Promise<void> {
        const game = await this.gameService.findGame(request.gameId);
        const player = this.authService.decodeJwt(request.jwt);
        if (game && player) {
            if (this.gameService.playerInGame(game, player)) {
                await this.updateClientPlayerLists(game);
                client.join(game.id);
                this.clientPlayerGameMapping.set(client, [game, player]);
            } else {
                throw new WsException('Unauthorized');
            }
        } else {
            throw new WsException(`Game with ID ${request.gameId} not found`);
        }
    }

    @SubscribeMessage('start')
    async handleStart(client: Socket): Promise<void> {
        const [game, player] = this.clientPlayerGameMapping.get(client);
        if (game && player) {
            if (player.id === game.owner.id) {
                game.state = 'question' as const;
                this.server.to(game.id).emit('start');
            } else {
                throw new WsException('Unauthorized');
            }
        } else {
            throw new WsException('Not found');
        }
    }

    async handleDisconnect(client: Socket): Promise<void> {
        const [game, player] = this.clientPlayerGameMapping.get(client);
        if (game && player) {
            await this.gameService.removePlayer(game, player);
            await this.updateClientPlayerLists(game);
        }
    }

    async updateClientPlayerLists(game: Game): Promise<void> {
        this.server.to(game.id).emit('newPlayerList', {
            owner: game.owner,
            players: game.players
        } as PlayerListDto);
    }
}
