import { Module } from '@nestjs/common';
import { InitController } from './init.controller';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';
import { GameplayModule } from '../gameplay/gameplay.module';

@Module({
    imports: [AuthModule, GameModule, PlayerModule, GameplayModule],
    controllers: [InitController]
})
export class InitModule {}
