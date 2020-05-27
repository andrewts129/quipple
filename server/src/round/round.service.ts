import { Injectable } from '@nestjs/common';
import { Round } from './round.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoundService {
    constructor(@InjectRepository(Round) private roundRepository: Repository<Round>) {}

    async activeRound(gameId: string): Promise<Round> {
        return this.roundRepository.findOne({ gameId, active: true });
    }
}
