import { Player } from '../../../player/player.entity';

export class CreateJoinResponseDto {
    gameId: string;
    player: Player;
    jwt: string;
}
