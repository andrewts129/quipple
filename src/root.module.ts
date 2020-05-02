import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';

@Module({
    imports: [AuthModule, GameModule],
    controllers: [ViewController]
})
export class RootModule {}
