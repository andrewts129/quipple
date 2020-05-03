import { Player } from './player.model';
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

    playersEqual(a: Player, b: Player): boolean {
        return a.id === b.id && a.screenName === b.screenName;
    }
}
