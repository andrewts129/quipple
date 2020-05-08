import { Player } from '../../../player/player.model';

export class CreateJoinResponseDto {
    gameId: string;
    player: Player;
    jwt: string;
}
