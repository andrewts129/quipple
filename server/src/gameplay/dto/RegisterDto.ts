import { IsAlpha, IsUppercase, Length } from 'class-validator';
import { Player } from '../../player/player.model';

export class RegisterDto {
    @IsAlpha() // TODO doesn't work?
    @IsUppercase()
    @Length(5, 5)
    gameId: string;

    player: Player;
}
