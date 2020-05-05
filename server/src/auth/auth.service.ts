import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Player } from '../player/player.model';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async getJwt(player: Player): Promise<string> {
        return this.jwtService.sign({
            sub: player.id,
            screenName: player.screenName
        });
    }

    extractJwt(req: Request): string | null {
        if (req && req.cookies) {
            return req.cookies.jwt;
        } else {
            return null;
        }
    }

    extractPlayer(req: Request): Player | null {
        const jwt = this.extractJwt(req);
        if (jwt) {
            return this.decodeJwt(jwt);
        } else {
            return null;
        }
    }

    parsePayload(payload: any): Player {
        return {
            id: payload.sub,
            screenName: payload.screenName
        };
    }

    decodeJwt(jwt: string): Player {
        const payload = this.jwtService.verify(jwt);
        return this.parsePayload(payload);
    }
}
