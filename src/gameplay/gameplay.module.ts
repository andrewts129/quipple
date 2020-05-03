import { Module } from '@nestjs/common';
import { GameplayController } from './gameplay.controller';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';

@Module({
    imports: [AuthModule, GameModule, PlayerModule],
    controllers: [GameplayController]
})
export class GameplayModule {}
