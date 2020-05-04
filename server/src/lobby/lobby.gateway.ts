import {
    SubscribeMessage,
    WebSocketGateway,
    MessageBody,
    WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GetPlayersDto } from './dto/GetPlayersDto';
import { PlayerListDto } from './dto/PlayerListDto';
import { GameService } from '../game/game.service';

@WebSocketGateway()
export class LobbyGateway {
    constructor(private gameService: GameService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('getPlayers')
    async getPlayers(@MessageBody() request: GetPlayersDto): Promise<PlayerListDto> {
        const game = await this.gameService.findGame(request.gameId);
        return {
            players: await this.gameService.allPlayers(game)
        };
    }
}
