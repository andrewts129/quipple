import { Controller, Get, Render, Param } from '@nestjs/common';

@Controller()
export class ViewController {
    @Get()
    @Render('index')
    index() {
        return {};
    }

    @Get('/lobby/:id')
    @Render('lobby')
    lobby(@Param() params) {
        return { gameId: params.id }
    }
}
