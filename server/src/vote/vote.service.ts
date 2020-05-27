import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { Repository } from 'typeorm';
import { RoundService } from '../round/round.service';

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Vote) private voteRepository: Repository<Vote>,
        private roundService: RoundService
    ) {}

    // Returns all votes cast in that round so far
    async placeVote(gameId: string, forPlayerId: number): Promise<Vote[]> {
        // TODO transaction?
        const round = await this.roundService.activeRound(gameId);
        await this.voteRepository.save({
            round,
            forPlayerId
        });

        return this.voteRepository.find({ round });
    }
}
