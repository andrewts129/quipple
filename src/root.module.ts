import { Module } from '@nestjs/common';
import { ViewController } from './controllers/view.controller';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { PlayerService } from './services/player.service';

@Module({
    imports: [],
    controllers: [ViewController, GameController],
    providers: [GameService, PlayerService]
})
export class RootModule {}
