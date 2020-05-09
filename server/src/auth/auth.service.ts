import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Player } from '../player/player.model';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async createJwt(player: Player): Promise<string> {
        return this.jwtService.sign({
            sub: player.id,
            screenName: player.screenName
        });
    }

    decodeJwt(jwt: string): Player {
        const payload = this.jwtService.verify(jwt);
        return this.parsePayload(payload);
    }

    private parsePayload(payload: any): Player {
        return {
            id: payload.sub,
            screenName: payload.screenName
        };
    }
}
