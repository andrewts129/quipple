import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { GameplayGateway } from './gameplay.gateway';
import { AuthModule } from '../auth/auth.module';
import { VoteModule } from '../vote/vote.module';

@Module({
    imports: [GameModule, AuthModule, VoteModule],
    providers: [GameplayGateway],
    exports: [GameplayGateway]
})
export class GameplayModule {}
