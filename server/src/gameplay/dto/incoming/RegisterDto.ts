import { IsAlpha, IsUppercase, Length } from 'class-validator';

export class RegisterDto {
    @IsAlpha() // TODO doesn't work?
    @IsUppercase()
    @Length(5, 5)
    gameId: string;

    jwt: string;
}
