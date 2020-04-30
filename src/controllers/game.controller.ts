import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { JoinGameDto } from 'src/dto/JoinGameDto';
import { JoinGameValidationPipe } from 'src/pipes/JoinGameValidationPipe';

@Controller()
export class GameController {
    @Post('join')
    @UsePipes(new JoinGameValidationPipe())
    join(@Body() body: JoinGameDto) {
        return body;
    }
}
