import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
// import { HealthModule } from '@async-communication/nest-health';
import { BackendDocsModule } from '@async-communication/nest-swgger-docs';
import { BackendLoggerModule } from '@async-communication/nest-logger';
import { mongoConfig } from '@async-communication/backend-envs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  PredictionSchema,
  Prediction,
  PredictionsService,
} from '@async-communication/predictions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // cache: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'prediction-queue',
      redis: {
        port: 6379,
        host: process.env.REDIS_HOST || 'localhost',
      },
    }),
    // todo duplicated
    MongooseModule.forRoot(mongoConfig().MONGO_URI, {}),
    MongooseModule.forFeature([
      { name: Prediction.name, schema: PredictionSchema },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Prediction.name,
        useFactory: () => {
          const schema = PredictionSchema;
          schema.pre('save', function () {
            console.log('Hello from pre save');
          });
          return schema;
        },
      },
    ]),
    // HealthModule, // todo add
    BackendDocsModule,
    BackendLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, PredictionsService],
})
export class AppModule {}
