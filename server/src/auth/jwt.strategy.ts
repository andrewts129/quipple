import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { GameService } from '../game/game.service';

const extractGameId = (request: Request): string | null => {
    if (request.params.gameId) {
        return request.params.gameId;
    } else if (request.body.gameId) {
        return request.body.gameId;
    } else {
        return null;
    }
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private gameService: GameService) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromExtractors([authService.extractJwt]),
            secretOrKey: process.env.JWT_SECRET_KEY
        });
    }

    async validate(request: Request, payload: any) {
        const player = this.authService.parsePayload(payload);

        const gameId = extractGameId(request);
        const game = await this.gameService.findGame(gameId);

        if (game && (await this.gameService.playerInGame(game, player))) {
            return player;
        } else {
            throw new UnauthorizedException();
        }
    }
}
