import { Module } from '@nestjs/common';
import { ViewController } from './controllers/view.controller';
import { GameController } from './controllers/game.controller';

@Module({
    imports: [],
    controllers: [ViewController, GameController],
    providers: []
})
export class RootModule {}
