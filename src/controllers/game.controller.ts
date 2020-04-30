import { Controller, Post, Body, UsePipes, Redirect } from '@nestjs/common';
import { JoinGameDto } from '../dto/JoinGameDto';
import { JoinGameValidationPipe } from '../pipes/JoinGameValidationPipe';

const randomGameId = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fiveRandomLetters = Array.from({ length: 5 }, () => {
        const index = Math.floor(Math.random() * letters.length);
        return letters[index];
    });
    return fiveRandomLetters.join('');
};

@Controller()
export class GameController {
    @Post('join')
    @Redirect('/lobby', 303)
    @UsePipes(new JoinGameValidationPipe())
    join(@Body() body: JoinGameDto) {
        if (body.start) {
            const newGameId = randomGameId();
            // TODO create and join game
            return {
                url: `/lobby/${newGameId}`
            };
        } else if (body.join) {
            // TODO join game
            return {
                url: `/lobby/${body.gameIdToJoin}`
            };
        }
    }
}
