import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { GameplayGateway } from './gameplay.gateway';
import { AuthModule } from '../auth/auth.module';
import { QuestionModule } from '../question/question.module';

@Module({
    imports: [GameModule, AuthModule, QuestionModule],
    providers: [GameplayGateway],
    exports: [GameplayGateway]
})
export class GameplayModule {}
