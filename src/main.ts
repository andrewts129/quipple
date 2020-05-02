import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RootModule } from './root.module';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(RootModule);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    app.use(cookieParser());

    await app.listen(process.env.PORT || 3000);
};
bootstrap();
