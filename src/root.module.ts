import { Module } from '@nestjs/common';
import { ViewController } from './controllers/view.controller';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { PlayerService } from './services/player.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: 'secretSauce',
            signOptions: { expiresIn: '60s' }
        })
    ],
    controllers: [ViewController, GameController],
    providers: [GameService, PlayerService, AuthService, JwtStrategy]
})
export class RootModule {}
