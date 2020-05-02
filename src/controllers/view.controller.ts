import { Controller, Get, Render, Param, NotFoundException } from '@nestjs/common';
import { GameService } from '../services/game.service';

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
    async lobby(@Param() params) {
        const game = await this.gameService.findGame(params.id);
        if (game) {
            return { game };
        } else {
            throw new NotFoundException(`Game with ID ${params.id} not found`);
        }
    }
}
