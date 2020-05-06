import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GameModule } from '../game/game.module';

@Module({
    imports: [
        GameModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '30 minutes' }
        })
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
