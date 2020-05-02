import { Length, IsAlpha, IsUppercase } from 'class-validator';

export class StartGameDto {
    @IsAlpha() // TODO doesn't work?
    @IsUppercase()
    @Length(5, 5)
    gameId: string;
}
