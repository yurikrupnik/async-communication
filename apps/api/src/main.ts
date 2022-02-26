import { VersioningType, ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from '@async-communication/nest-filters';
import { ConfigService } from '@nestjs/config';
import { BackendDocsModule } from '@async-communication/nest-swgger-docs';
import { serverAdapter } from './app/queues/prediction.queue';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const globalPrefix = 'api';
  // start custom config here
  app.enableCors();

  // app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // end custom config
  app.use(helmet());
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.contentSecurityPolicy());
  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();
  // end custom config

  // swagger docs
  const docs = app.get(BackendDocsModule);
  docs.setup(app, globalPrefix, 'Predictions Api', 'AI prediction control api');

  serverAdapter.setBasePath('/admin/queues');
  app.use('/admin/queues', serverAdapter.getRouter());

  const port = configService.get('PORT') || 3333;
  await app.listen(port);
  Logger.log(`Listening at http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
