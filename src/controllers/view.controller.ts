import { Controller, Get, Render, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { JwtAuthGuard } from '../jwt.auth.guard';

@Controller()
export class ViewController {
    constructor(private gameService: GameService) {}

    @Get()
    @Render('index')
    index() {
        return {};
    }

    @Get('/lobby/:id')
    @Render('lobby')
    @UseGuards(JwtAuthGuard)
    async lobby(@Param() params) {
        const game = await this.gameService.findGame(params.id);
        if (game) {
            return { game };
        } else {
            throw new NotFoundException(`Game with ID ${params.id} not found`);
        }
    }

    @Get('/game/:id')
    @Render('game')
    @UseGuards(JwtAuthGuard)
    async game(@Param() params) {
        const game = await this.gameService.findGame(params.id);
        if (game) {
            return { game };
        } else {
            throw new NotFoundException(`Game with ID ${params.id} not found`);
        }
    }
}
