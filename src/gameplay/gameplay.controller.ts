import {
    Controller,
    Post,
    Body,
    UsePipes,
    Redirect,
    NotFoundException,
    BadRequestException,
    Res,
    UseGuards
} from '@nestjs/common';
import { JoinGameDto } from './dto/JoinGameDto';
import { JoinGameValidationPipe } from './pipes/JoinGameValidationPipe';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.model';
import { StartGameDto } from './dto/StartGameDto';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller()
export class GameplayController {
    constructor(
        private gameService: GameService,
        private playerService: PlayerService,
        private authService: AuthService
    ) {}

    @Post('join')
    @UsePipes(new JoinGameValidationPipe())
    async join(@Body() body: JoinGameDto, @Res() res: Response) {
        let player: Player;
        let gameIdToRedirectTo: string;

        if (body.start) {
            const newGame = await this.gameService.createGame(body.screenName);
            gameIdToRedirectTo = newGame.id;
            player = newGame.creator;
        } else if (body.join) {
            const game = await this.gameService.findGame(body.gameIdToJoin);
            if (game) {
                player = await this.playerService.createPlayer(body.screenName);
                await this.gameService.addPlayer(game, player);
                gameIdToRedirectTo = body.gameIdToJoin;
            } else {
                throw new NotFoundException(`Game with ID ${body.gameIdToJoin} not found`);
            }
        } else {
            // This should never trigger because of the input validation
            throw new BadRequestException('Invalid action');
        }

        res.cookie('jwt', await this.authService.getJwt(player));
        res.redirect(303, `/lobby/${gameIdToRedirectTo}`);
    }

    @Post('start')
    @Redirect('/game', 303)
    @UseGuards(JwtAuthGuard)
    async start(@Body() body: StartGameDto) {
        // TODO start game
        // TODO redirect other players too
        return {
            url: `/game/${body.gameId}`
        };
    }
}
