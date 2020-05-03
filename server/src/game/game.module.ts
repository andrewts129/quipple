import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayerModule } from '../player/player.module';

@Module({
    imports: [PlayerModule],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
