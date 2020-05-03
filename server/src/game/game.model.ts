import { Player } from '../player/player.model';

export class Game {
    id: string;
    creator: Player;
    players: Player[];
    state: 'New' | 'Running';
}
