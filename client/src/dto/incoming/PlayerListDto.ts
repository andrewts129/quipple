import { Player } from '../../model/player';

export interface PlayerListDto {
    owner: Player;
    players: Player[];
}
