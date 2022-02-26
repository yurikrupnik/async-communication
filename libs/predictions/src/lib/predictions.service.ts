import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prediction, PredictionDocument } from './predictions.schema';
import { CreatePredictServiceDto } from './predictions.dto';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectModel(Prediction.name)
    private predictionModel: Model<PredictionDocument>
  ) {}

  create(createCatDto: CreatePredictServiceDto): Promise<Prediction> {
    const createdCat = new this.predictionModel(createCatDto);
    return createdCat.save().catch((err) => {
      throw new Error('failed to save prediction');
    });
  }

  findAll(query: Partial<Prediction>, projection: [string] | string | null) {
    return this.predictionModel.find(query, projection).exec();
  }
}
