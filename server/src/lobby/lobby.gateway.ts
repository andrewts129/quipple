import {
    SubscribeMessage,
    WebSocketGateway,
    MessageBody,
    WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GetPlayersDto } from './dto/GetPlayersDto';
import { SendPlayersDto } from './dto/SendPlayersDto';
import { GameService } from '../game/game.service';

@WebSocketGateway()
export class LobbyGateway {
    constructor(private gameService: GameService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('getPlayers')
    async getPlayers(@MessageBody() request: GetPlayersDto): Promise<SendPlayersDto> {
        const game = await this.gameService.findGame(request.gameId);
        return {
            players: await this.gameService.allPlayers(game)
        };
    }
}
