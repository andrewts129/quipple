import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './round.entity';
import { Answer } from './answer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Round]), TypeOrmModule.forFeature([Answer])],
    providers: [RoundService],
    exports: [RoundService]
})
export class RoundModule {}
