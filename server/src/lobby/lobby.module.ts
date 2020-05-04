import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';
import { LobbyGateway } from './lobby.gateway';

@Module({
    imports: [AuthModule, GameModule, PlayerModule],
    providers: [LobbyGateway],
    controllers: [LobbyController]
})
export class LobbyModule {}
