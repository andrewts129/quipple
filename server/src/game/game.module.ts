import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayerModule } from '../player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { RoundModule } from '../round/round.module';
import { QuestionModule } from '../question/question.module';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), PlayerModule, RoundModule, QuestionModule],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
