import { Module } from '@nestjs/common';
import { ViewController } from './controllers/view.controller';
import { AppService } from './services/app.service';

@Module({
    imports: [],
    controllers: [ViewController],
    providers: [AppService],
})
export class RootModule {}
