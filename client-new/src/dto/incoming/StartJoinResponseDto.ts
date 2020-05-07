import { Player } from '../../model/player';

export interface StartJoinResponseDto {
    gameId: string;
    player: Player;
    jwt: string;
}
