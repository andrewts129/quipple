import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RegisterDto } from './dto/RegisterDto';
import { GameService } from '../game/game.service';
import { Game } from '../game/game.model';
import { PlayerListDto } from './dto/PlayerListDto';
import { Player } from '../player/player.model';
import { NotFoundException } from '@nestjs/common';

// TODO validation & auth
@WebSocketGateway({ namespace: 'lobby' })
export class GameplayGateway implements OnGatewayDisconnect {
    constructor(private gameService: GameService) {}

    @WebSocketServer()
    private server: Server;

    private clientPlayerGameMapping: Map<Socket, [Game, Player]> = new Map();

    @SubscribeMessage('register')
    async handleRegister(client: Socket, request: RegisterDto): Promise<void> {
        const game = await this.gameService.findGame(request.gameId);
        if (game) {
            await this.updateClientPlayerLists(game);
            client.join(game.id);
            this.clientPlayerGameMapping.set(client, [game, request.player]);
        } else {
            throw new NotFoundException(`Game with ID ${request.gameId} not found`);
        }
    }

    @SubscribeMessage('start')
    async handleStart(client: Socket): Promise<void> {
        // TODO make sure only owner can start
        const [game, player] = this.clientPlayerGameMapping.get(client);
        if (game && player) {
            game.state = 'Running' as const;
            this.server.to(game.id).emit('start');
        } else {
            throw new NotFoundException(`Unknown user`);
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
