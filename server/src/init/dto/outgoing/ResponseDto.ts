import { Player } from '../../../player/player.model';

export class ResponseDto {
    gameId: string;
    player: Player;
    jwt: string;
}
