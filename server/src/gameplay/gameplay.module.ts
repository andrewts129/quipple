import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { GameplayGateway } from './gameplay.gateway';

@Module({
    imports: [GameModule],
    providers: [GameplayGateway],
    exports: [GameplayGateway]
})
export class GameplayModule {}
