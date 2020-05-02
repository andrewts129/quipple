import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Player } from '../models/player.model';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async getJwt(player: Player): Promise<string> {
        return this.jwtService.sign({
            sub: player.id,
            screenName: player.screenName
        });
    }
}
