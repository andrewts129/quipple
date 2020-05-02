import {
    Controller,
    Post,
    Body,
    UsePipes,
    Redirect,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { JoinGameDto } from '../dto/JoinGameDto';
import { JoinGameValidationPipe } from '../pipes/JoinGameValidationPipe';
import { GameService } from '../services/game.service';

@Controller()
export class GameController {
    constructor(private gameService: GameService) {}

    @Post('join')
    @Redirect('/lobby', 303)
    @UsePipes(new JoinGameValidationPipe())
    async join(@Body() body: JoinGameDto) {
        let gameIdToRedirectTo;

        if (body.start) {
            const newGame = await this.gameService.createGame(body.screenName);
            gameIdToRedirectTo = newGame.id;
        } else if (body.join) {
            const game = await this.gameService.findGame(body.gameIdToJoin);
            if (game) {
                await this.gameService.addPlayer(game, body.screenName);
                gameIdToRedirectTo = body.gameIdToJoin;
            } else {
                throw new NotFoundException(`Game with ID ${body.gameIdToJoin} not found`);
            }
        } else {
            // This should never trigger because of the input validation
            throw new BadRequestException('Invalid action');
        }

        return {
            url: `/lobby/${gameIdToRedirectTo}`
        };
    }
}
