import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';

@Module({
    imports: [AuthModule, GameModule, PlayerModule],
    controllers: [LobbyController]
})
export class LobbyModule {}
