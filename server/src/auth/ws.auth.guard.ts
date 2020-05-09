import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from './auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client = context.switchToWs().getClient<Socket>();
            const jwt = client.handshake.query?.jwt;
            const player = this.authService.decodeJwt(jwt);
            return Boolean(player);
        } catch (error) {
            throw new WsException(error.message);
        }
    }
}
