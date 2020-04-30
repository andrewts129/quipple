import { Length, IsAlphanumeric, IsAlpha, IsNotEmpty, IsLowercase } from 'class-validator';

export class JoinGameDto {
    @IsAlphanumeric('en-US', { always: true })
    @Length(3, 20, { always: true })
    screenName: string;

    @IsAlpha() // TODO doesn't work?
    @IsLowercase()
    @Length(5, 5, { groups: ['join'] })
    gameIdToJoin: string;

    @IsNotEmpty({ groups: ['start'] })
    start?: string;

    @IsNotEmpty({ groups: ['join'] })
    join?: string;
}
