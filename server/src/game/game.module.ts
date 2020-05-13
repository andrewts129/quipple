import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayerModule } from '../player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), PlayerModule],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
