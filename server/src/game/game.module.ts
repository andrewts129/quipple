import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayerModule } from '../player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { QuestionModule } from '../question/question.module';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), PlayerModule, QuestionModule],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
