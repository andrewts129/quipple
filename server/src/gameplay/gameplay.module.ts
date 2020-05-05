import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { GameplayGateway } from './gameplay.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [GameModule, AuthModule],
    providers: [GameplayGateway],
    exports: [GameplayGateway]
})
export class GameplayModule {}
