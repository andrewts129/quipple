import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

const cookieExtractor = (req: Request): string => {
    if (req && req.cookies) {
        return req.cookies.jwt;
    } else {
        return null;
    }
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: 'secretSauce'
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, screenName: payload.screenName };
    }
}
