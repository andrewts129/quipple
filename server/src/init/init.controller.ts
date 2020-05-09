import { Controller, Post, Body, UsePipes, NotFoundException } from '@nestjs/common';
import { JoinGameDto } from './dto/incoming/JoinGameDto';
import { JoinGameValidationPipe } from './pipes/JoinGameValidationPipe';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { AuthService } from '../auth/auth.service';
import { GameplayGateway } from '../gameplay/gameplay.gateway';
import { CreateGameDto } from './dto/incoming/CreateGameDto';
import { CreateJoinResponseDto } from './dto/outgoing/CreateJoinResponseDto';
import { CreateGameValidationPipe } from './pipes/CreateGameValidationPipe';

@Controller()
export class InitController {
    constructor(
        private gameplayGateway: GameplayGateway,
        private gameService: GameService,
        private playerService: PlayerService,
        private authService: AuthService
    ) {}

    @Post('create')
    @UsePipes(new CreateGameValidationPipe())
    async create(@Body() body: CreateGameDto): Promise<CreateJoinResponseDto> {
        const game = await this.gameService.createGame(body.screenName);
        const player = game.owner;

        return {
            gameId: game.id,
            player,
            jwt: await this.authService.createJwt(player)
        };
    }

    @Post('join')
    @UsePipes(new JoinGameValidationPipe())
    async join(@Body() body: JoinGameDto): Promise<CreateJoinResponseDto> {
        const game = await this.gameService.findGame(body.gameIdToJoin);
        if (game) {
            const player = await this.playerService.createPlayer(body.screenName);
            await this.gameService.addPlayer(game, player);
            this.gameplayGateway.updateClientPlayerLists(game);

            return {
                gameId: game.id,
                player,
                jwt: await this.authService.createJwt(player)
            };
        } else {
            throw new NotFoundException(`Game with ID ${body.gameIdToJoin} not found`);
        }
    }
}
