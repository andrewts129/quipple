import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from './auth.service';
import { Player } from '../player/player.model';

export interface AuthenticatedData {
    player: Player;
}

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client = context.switchToWs().getClient<Socket>();
            const jwt = client.handshake.query?.jwt;
            const player = this.authService.decodeJwt(jwt);
            context.switchToWs().getData().player = player; // Gives functions behind guard access to `player`
            return Boolean(player);
        } catch (error) {
            throw new WsException(error.message);
        }
    }
}
