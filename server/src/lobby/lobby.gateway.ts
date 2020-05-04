import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dto/JoinRoomDto';
import { GameService } from '../game/game.service';
import { Game } from '../game/game.model';
import { PlayerListDto } from './dto/PlayerListDto';

@WebSocketGateway({ namespace: 'lobby' })
export class LobbyGateway {
    constructor(private gameService: GameService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinRoom')
    joinRoom(client: Socket, request: JoinRoomDto): void {
        client.join(request.gameId);
    }

    async updateClientPlayerLists(game: Game): Promise<void> {
        this.server.to(game.id).emit('newPlayerList', {
            players: await this.gameService.allPlayers(game)
        } as PlayerListDto);
    }
}
