import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
// import { graphqlUploadExpress } from 'graphql-upload';
import cookieParser from 'cookie-parser';
import { logger } from './common/utils/logger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: logger,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    credentials: true,
    origin: process.env?.ORIGIN?.split(', '),
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'src/views/assets'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('hbs');
  // app.setGlobalPrefix('/api/v1');

  // app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  const config = new DocumentBuilder()
    .setTitle('Fake Shop')
    .setDescription('Fake Shop For Testing By zax4r0')
    .setVersion('1.0')
    // .addTag('By zax4r0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document);

  const port = process.env?.PORT || 80;
  await app.listen(port, async () => {
    console.log(`\n
        ======================================================
          ENV: ${process.env.NODE_ENV}🚧
          http://localhost:${port}🚀
          http://localhost:${port}/graphql🚀

        ======================================================
    \n`);
  });
}
bootstrap();
