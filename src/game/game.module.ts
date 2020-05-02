import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PlayerModule } from '../player/player.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PlayerModule, AuthModule],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
