import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VoteService {
    constructor(@InjectRepository(Vote) private voteRepository: Repository<Vote>) {}

    async saveVote(gameId: string, forPlayerId: number): Promise<Vote> {
        return this.voteRepository.save({ gameId, forPlayerId });
    }

    async getVotes(gameId: string): Promise<Vote[]> {
        return this.voteRepository.find({ gameId });
    }

    async clearVotes(_gameId: string): Promise<void> {
        // TODO
    }
}
