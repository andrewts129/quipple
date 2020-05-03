import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { GameplayModule } from './gameplay/gameplay.module';

@Module({
    imports: [AuthModule, GameModule, PlayerModule, GameplayModule],
    controllers: [ViewController]
})
export class RootModule {}
