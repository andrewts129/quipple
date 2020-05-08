import { Length, IsAlphanumeric, IsAlpha, IsUppercase } from 'class-validator';

export class JoinGameDto {
    @IsAlphanumeric('en-US')
    @Length(3, 20)
    screenName: string;

    @IsAlpha() // TODO doesn't work?
    @IsUppercase()
    @Length(5, 5)
    gameIdToJoin: string;
}
