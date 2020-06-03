import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { RoundModule } from '../round/round.module';

@Module({
    imports: [TypeOrmModule.forFeature([Vote]), RoundModule],
    providers: [VoteService],
    exports: [VoteService]
})
export class VoteModule {}
