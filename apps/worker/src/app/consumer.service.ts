import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Job, DoneCallback } from 'bull';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import random from 'lodash/random';
import hash from 'object-hash';
import {
  CreatePredictDto,
  PredictionsService,
} from '@async-communication/predictions';

const getPrediction = () => random(1, 1000);

@Processor('prediction-queue')
export class PredictionConsumer {
  constructor(
    private readonly predictionsService: PredictionsService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  @Process('prediction-job')
  messageJob(job: Job<CreatePredictDto>, cb: DoneCallback) {
    const redisHashKey = hash(job.data);
    // console.log('redisHashKey', redisHashKey);
    this.redis
      .get(redisHashKey)
      .then((res) => {
        const data = JSON.parse(res);
        console.log('data', data);
        if (!data) {
          return this.predictionsService
            .create({ ...job.data, predictionResult: getPrediction() })
            .then((newPrediction) => {
              this.redis
                .set(redisHashKey, JSON.stringify(newPrediction))
                .then(() => {
                  cb(null, newPrediction);
                })
                .catch(cb);
            })
            .catch(cb);
        } else {
          cb(null, data);
        }
      })
      .catch(cb);
  }

  @OnQueueActive()
  onActive(job: Job<CreatePredictDto>) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data`,
      job.data
    );
  }
}
