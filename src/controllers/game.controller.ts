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
import { PlayerService } from '../services/player.service';
import { Player } from '../models/player.model';
import { StartGameDto } from '../dto/StartGameDto';

@Controller()
export class GameController {
    constructor(private gameService: GameService, private playerService: PlayerService) {}

    @Post('join')
    @Redirect('/lobby', 303)
    @UsePipes(new JoinGameValidationPipe())
    async join(@Body() body: JoinGameDto) {
        let thisPlayer: Player;
        let gameIdToRedirectTo: string;

        if (body.start) {
            const newGame = await this.gameService.createGame(body.screenName);
            gameIdToRedirectTo = newGame.id;
            thisPlayer = newGame.creator;
        } else if (body.join) {
            const game = await this.gameService.findGame(body.gameIdToJoin);
            if (game) {
                thisPlayer = await this.playerService.createPlayer(body.screenName);
                await this.gameService.addPlayer(game, thisPlayer);
                gameIdToRedirectTo = body.gameIdToJoin;
            } else {
                throw new NotFoundException(`Game with ID ${body.gameIdToJoin} not found`);
            }
        } else {
            // This should never trigger because of the input validation
            throw new BadRequestException('Invalid action');
        }

        // TODO do something with player
        return {
            url: `/lobby/${gameIdToRedirectTo}`
        };
    }

    @Post('start')
    @Redirect('/game', 303)
    async start(@Body() body: StartGameDto) {
        // TODO start game
        // TODO redirect other players too
        return {
            url: `/game/${body.gameId}`
        };
    }
}
