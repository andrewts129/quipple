require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RootModule } from './root.module';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(RootModule);

    app.useStaticAssets(join(__dirname, '..', '..', 'client', 'build'), {
        redirect: false
    });

    // TODO still needed?
    app.use(cookieParser());

    await app.listen(process.env.PORT || 3001);
};
bootstrap();
