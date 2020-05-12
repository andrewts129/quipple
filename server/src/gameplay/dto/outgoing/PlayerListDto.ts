import { Player } from '../../../player/player.entity';

export class PlayerListDto {
    owner: Player;
    players: Player[];
}
