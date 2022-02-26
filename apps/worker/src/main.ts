import { VersioningType, ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from '@async-communication/nest-filters';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const globalPrefix = 'api';
  // start custom config here
  app.enableCors();

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

  const port = configService.get('PORT') || 3334;
  await app.listen(port);
  Logger.log(`Listening at http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

// fix it in docker, no actuall port for microservice failing with connecting - locally works
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
//
// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.REDIS,
//       options: {
//         url: process.env.REDIS_URL
//           ? process.env.REDIS_URL
//           : // `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}` ||
//           'redis://localhost:6379',
//       },
//     }
//   );
//
//   app.listen().then(() => {
//     console.log('Posts service is listening...');
//   });
// }
//
// bootstrap();
