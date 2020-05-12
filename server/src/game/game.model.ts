import { Player } from '../player/player.entity';

export class Game {
    id: string;
    owner: Player;
    players: Player[];
    stage: 'lobby' | 'starting' | 'question';
}
