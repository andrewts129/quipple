import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { JoinGameDto } from '../dto/JoinGameDto';
import { JoinGameValidationPipe } from '../pipes/JoinGameValidationPipe';

@Controller()
export class GameController {
    @Post('join')
    @UsePipes(new JoinGameValidationPipe())
    join(@Body() body: JoinGameDto) {
        return body;
    }
}
