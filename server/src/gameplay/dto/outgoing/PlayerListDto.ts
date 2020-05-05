import { Player } from '../../../player/player.model';

export class PlayerListDto {
    owner: Player;
    players: Player[];
}
