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
import { LobbyGateway } from './lobby.gateway';

@Controller()
export class LobbyController {
    constructor(
        private lobbyGateway: LobbyGateway,
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

                await this.lobbyGateway.updateClientPlayerLists(game);
            } else {
                throw new NotFoundException(`Game with ID ${body.gameIdToJoin} not found`);
            }
        } else {
            // This should never trigger because of the input validation
            throw new BadRequestException('Invalid action');
        }

        res.cookie('jwt', await this.authService.getJwt(player));
        res.redirect(303, `/${gameIdToRedirectTo}/lobby`);
    }

    @Post('start')
    @Redirect('/gameIdGoesHere/game', 303) // URL always overwritten
    @UseGuards(JwtAuthGuard)
    async start(@Body() body: StartGameDto) {
        const game = await this.gameService.findGame(body.gameId);
        if (game) {
            game.state = 'Running' as const;
            // TODO redirect other players too
            return {
                url: `/${body.gameId}/game`
            };
        } else {
            throw new NotFoundException(`Game with ID ${body.gameId} not found`);
        }
    }
}
