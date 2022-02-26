import { Prediction } from './predictions.schema';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';
import { JobId } from 'bull';

export class CreatePredictDto extends OmitType(Prediction, [
  '_id',
  'predictionResult',
]) {}

export class CreatePredictServiceDto extends OmitType(Prediction, ['_id']) {}

export class CreatePredictResponseDto extends CreatePredictDto {
  @Prop([String, Number])
  @ApiProperty({
    description: 'Redis job Id',
    type: Number, // todo handle also String type = see JobId
    example: 5,
  })
  // eslint-disable-next-line
  // @ts-ignore
  jobId: JobId;
}
