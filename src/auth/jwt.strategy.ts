import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([authService.extractJwt]),
            secretOrKey: process.env.JWT_SECRET_KEY
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, screenName: payload.screenName };
    }
}
