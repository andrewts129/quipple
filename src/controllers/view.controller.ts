import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class ViewController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Render('index')
    index() {
        return {}
    }
}
