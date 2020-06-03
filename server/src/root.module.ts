import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { GameplayModule } from './gameplay/gameplay.module';
import { InitModule } from './init/init.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { VoteModule } from './vote/vote.module';
import { RoundModule } from './round/round.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'client', 'build')
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            autoLoadEntities: true
        }),
        AuthModule,
        GameModule,
        PlayerModule,
        GameplayModule,
        InitModule,
        VoteModule,
        RoundModule
    ]
})
export class RootModule {}
