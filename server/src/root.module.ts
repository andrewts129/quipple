import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { GameplayModule } from './gameplay/gameplay.module';
import { InitModule } from './init/init.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'client', 'build')
        }),
        AuthModule,
        GameModule,
        PlayerModule,
        GameplayModule,
        InitModule
    ]
})
export class RootModule {}
