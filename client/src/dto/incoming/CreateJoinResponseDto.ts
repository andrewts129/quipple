import { Player } from '../../model/player';

export interface CreateJoinResponseDto {
    gameId: string;
    player: Player;
    jwt: string;
}
