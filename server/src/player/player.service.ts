import { Player } from './player.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayerService {
    constructor(@InjectRepository(Player) private playerRepository: Repository<Player>) {}

    async createPlayer(screenName: string): Promise<Player> {
        return this.playerRepository.save({ screenName });
    }

    async findPlayer(id: number): Promise<Player> {
        const player = await this.playerRepository.findOne({ id });
        if (player) {
            return player;
        } else {
            throw new NotFoundException(`Player with id ${id} not found`);
        }
    }
}
