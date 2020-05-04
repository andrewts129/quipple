import { Controller, Get, Render, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { GameService } from './game/game.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';

@Controller()
export class ViewController {
    constructor(private gameService: GameService, private authService: AuthService) {}

    @Get()
    @Render('index')
    index() {
        return {};
    }

    @Get('/:gameId/lobby')
    @Render('lobby')
    @UseGuards(JwtAuthGuard)
    async lobby(@Param('gameId') gameId: string, @Req() req: Request) {
        const game = await this.gameService.findGame(gameId);
        if (game) {
            const player = this.authService.extractPlayer(req);
            return { game, player, isOwner: player.id === game.owner.id };
        } else {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
    }

    @Get('/:gameId/game')
    @Render('game')
    @UseGuards(JwtAuthGuard)
    async game(@Param('gameId') gameId: string) {
        const game = await this.gameService.findGame(gameId);
        if (game) {
            return { game };
        } else {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
    }
}
