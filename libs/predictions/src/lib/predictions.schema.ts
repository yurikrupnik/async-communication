import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PredictionDocument = Prediction & Document;

@Schema({})
export class Prediction {
  @ApiProperty({
    description: `MongoDb object id`,
    readOnly: true,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  /*
   Mongodb object id
   */
  readonly _id?: string;

  // fix validate array of numbers
  @Prop({ type: [Number] })
  @ApiProperty({
    description: 'Predictions array',
    required: true,
    type: [Number],
    isArray: true,
  })
  @ArrayNotEmpty()
  /*
    Array of predictions
  */
  // eslint-disable-next-line
  // @ts-ignore
  predictions: number[];

  @Prop()
  @ApiProperty({
    description: 'Request Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  /*
    Prediction Request id
  */
  // eslint-disable-next-line
  // @ts-ignore
  requestId: string;

  @Prop()
  @ApiProperty({
    description: 'customerId Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  /*
    Prediction customer id
  */
  // eslint-disable-next-line
  // @ts-ignore
  customerId: string;

  @Prop()
  @ApiProperty({
    description: 'ModelId Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  /*
    Prediction model id
  */
  // eslint-disable-next-line
  // @ts-ignore
  modelId: string;

  @Prop()
  @ApiProperty({
    description: 'Prediction Result',
    // required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  /*
    Prediction model id
  */
  // eslint-disable-next-line
  // @ts-ignore
  predictionResult: number;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
