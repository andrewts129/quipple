require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RootModule } from './root.module';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(RootModule);
    await app.listen(process.env.PORT || 4000);
};
bootstrap();
