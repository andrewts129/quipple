import { Player } from '../player/player.model';

export class Game {
    id: string;
    owner: Player;
    players: Player[];
    state: 'New' | 'Running';
}
