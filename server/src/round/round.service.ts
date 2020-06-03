import { Injectable } from '@nestjs/common';
import { Round } from './round.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

@Injectable()
export class RoundService {
    constructor(
        @InjectRepository(Round) private roundRepository: Repository<Round>,
        private connection: Connection
    ) {}

    async activeRound(gameId: string): Promise<Round> {
        return this.roundRepository.findOne({ gameId, active: true });
    }

    async advanceRound(gameId: string): Promise<void> {
        await this.connection.transaction(async (manager) => {
            const rounds = (await manager.find('Round', { gameId })) as Round[];

            rounds.find((round) => !round.active).active = true;
            rounds.find((round) => round.active).active = false;

            await manager.save(rounds);
        });
    }
}
