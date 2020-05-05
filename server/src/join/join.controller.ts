import {
    Controller,
    Post,
    Body,
    UsePipes,
    NotFoundException,
    BadRequestException,
    Res
} from '@nestjs/common';
import { JoinGameDto } from './JoinGameDto';
import { JoinGameValidationPipe } from './JoinGameValidationPipe';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.model';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { GameplayGateway } from '../gameplay/gameplay.gateway';

@Controller()
export class JoinController {
    constructor(
        private gameplayGateway: GameplayGateway,
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
            player = newGame.owner;
        } else if (body.join) {
            const game = await this.gameService.findGame(body.gameIdToJoin);
            if (game) {
                player = await this.playerService.createPlayer(body.screenName);
                await this.gameService.addPlayer(game, player);
                gameIdToRedirectTo = body.gameIdToJoin;

                await this.gameplayGateway.updateClientPlayerLists(game);
            } else {
                throw new NotFoundException(`Game with ID ${body.gameIdToJoin} not found`);
            }
        } else {
            // This should never trigger because of the input validation
            throw new BadRequestException('Invalid action');
        }

        res.cookie('jwt', await this.authService.getJwt(player));
        res.redirect(303, `/${gameIdToRedirectTo}`);
    }
}
