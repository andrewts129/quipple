import { IsAlpha, IsUppercase, Length } from 'class-validator';

export class JoinRoomDto {
    @IsAlpha() // TODO doesn't work?
    @IsUppercase()
    @Length(5, 5)
    gameId: string;
}
