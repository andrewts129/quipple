import { Controller, Post, Body, UsePipes, NotFoundException } from '@nestjs/common';
import { JoinGameDto } from './dto/incoming/JoinGameDto';
import { JoinGameValidationPipe } from './pipes/JoinGameValidationPipe';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { AuthService } from '../auth/auth.service';
import { GameplayGateway } from '../gameplay/gameplay.gateway';
import { StartGameDto } from './dto/incoming/StartGameDto';
import { ResponseDto } from './dto/outgoing/ResponseDto';
import { StartGameValidationPipe } from './pipes/StartGameValidationPipe';

@Controller()
export class InitController {
    constructor(
        private gameplayGateway: GameplayGateway,
        private gameService: GameService,
        private playerService: PlayerService,
        private authService: AuthService
    ) {}

    @Post('start')
    @UsePipes(new StartGameValidationPipe())
    async start(@Body() body: StartGameDto): Promise<ResponseDto> {
        const game = await this.gameService.createGame(body.screenName);
        const player = game.owner;

        return {
            gameId: game.id,
            player,
            jwt: await this.authService.getJwt(player)
        };
    }

    @Post('join')
    @UsePipes(new JoinGameValidationPipe())
    async join(@Body() body: JoinGameDto): Promise<ResponseDto> {
        const game = await this.gameService.findGame(body.gameIdToJoin);
        if (game) {
            const player = await this.playerService.createPlayer(body.screenName);
            await this.gameService.addPlayer(game, player);
            this.gameplayGateway.updateClientPlayerLists(game);

            return {
                gameId: game.id,
                player,
                jwt: await this.authService.getJwt(player)
            };
        } else {
            throw new NotFoundException(`Game with ID ${body.gameIdToJoin} not found`);
        }
    }
}
