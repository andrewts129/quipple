import { Player } from '../models/player.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerService {
    private static serial = -1; // TODO this is bad

    async createPlayer(screenName: string): Promise<Player> {
        PlayerService.serial++;
        return {
            id: PlayerService.serial,
            screenName
        };
    }
}
