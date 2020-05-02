import { Module } from '@nestjs/common';
import { ViewController } from './controllers/view.controller';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { PlayerService } from './services/player.service';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ViewController, GameController],
    providers: [GameService, PlayerService]
})
export class RootModule {}
