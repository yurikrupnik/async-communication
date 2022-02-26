import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  CreatePredictResponseDto,
  CreatePredictDto,
} from '@async-communication/predictions';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('prediction-queue')
    private predictionQueue: Queue<CreatePredictDto>
  ) {}

  addToPredictionQueue(
    data: CreatePredictDto
  ): Promise<CreatePredictResponseDto> {
    return this.predictionQueue
      .add('prediction-job', data, {})
      .then((job): CreatePredictResponseDto => {
        return {
          ...data,
          jobId: job.id,
        };
      })
      .catch((err) => {
        console.log('err', err);
        throw Error('Failed to add job to a queue');
      });
  }
}
