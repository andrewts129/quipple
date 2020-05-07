import { Length, IsAlphanumeric } from 'class-validator';

export class StartGameDto {
    @IsAlphanumeric('en-US')
    @Length(3, 20)
    screenName: string;
}
