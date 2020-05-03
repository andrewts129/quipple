import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { LobbyModule } from './lobby/lobby.module';

@Module({
    imports: [AuthModule, GameModule, PlayerModule, LobbyModule],
    controllers: [ViewController]
})
export class RootModule {}
