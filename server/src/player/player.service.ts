import { Player } from './player.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayerService {
    constructor(@InjectRepository(Player) private playerRepository: Repository<Player>) {}

    async createPlayer(screenName: string): Promise<Player> {
        return this.playerRepository.save({ screenName });
    }
}
