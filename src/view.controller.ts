import { Controller, Get, Render, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { GameService } from './game/game.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';
import { PlayerService } from './player/player.service';

@Controller()
export class ViewController {
    constructor(
        private gameService: GameService,
        private playerService: PlayerService,
        private authService: AuthService
    ) {}

    @Get()
    @Render('index')
    index() {
        return {};
    }

    @Get('/lobby/:id')
    @Render('lobby')
    @UseGuards(JwtAuthGuard)
    async lobby(@Param('id') id: string, @Req() req: Request) {
        const game = await this.gameService.findGame(id);
        if (game) {
            const player = this.authService.extractPlayer(req);
            return { game, isOwner: this.playerService.playersEqual(game.creator, player) };
        } else {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }
    }

    @Get('/game/:id')
    @Render('game')
    @UseGuards(JwtAuthGuard)
    async game(@Param('id') id: string) {
        const game = await this.gameService.findGame(id);
        if (game) {
            return { game };
        } else {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }
    }
}
