import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@nestjs-modules/ioredis';
import { mongoConfig } from '@async-communication/backend-envs';
import { PredictionConsumer } from './consumer.service';
import {
  Prediction,
  PredictionSchema,
  PredictionsService,
} from '@async-communication/predictions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // cache: true,
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: process.env.REDIS_URI || 'redis://localhost:6379',
        },
      }),
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
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
    }),
    // todo duplicated
    MongooseModule.forRoot(mongoConfig().MONGO_URI, {}),
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
  ],
  providers: [PredictionConsumer, PredictionsService],
})
export class AppModule {}
