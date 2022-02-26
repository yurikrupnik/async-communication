import { Request } from 'express';
import { Controller, Query, Get, Post, Body, Req } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiQuery,
  PartialType,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  CreatePredictDto,
  CreatePredictResponseDto,
  Prediction,
  PredictionsService,
} from '@async-communication/predictions';
import { AppService } from './app.service';

enum Projection {
  modelId = 'modelId',
  requestId = 'requestId',
  customerId = 'customerId',
  prediction = 'prediction',
}

@Controller('/predictions')
@ApiTags('Predictions')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly predictionsService: PredictionsService
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The resources has been successfully published',
    type: CreatePredictResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to add job to a queue',
  })
  prediction(@Body() body: CreatePredictDto) {
    return this.appService.addToPredictionQueue(body);
  }

  @Get()
  @ApiOkResponse({
    description: 'The resources has been successfully retrieved',
    type: Prediction,
    isArray: true,
  })
  @ApiQuery({
    description: 'A list of projections for mongodb queries',
    name: 'search',
    type: PartialType(CreatePredictDto),
  })
  @ApiQuery({
    description: 'A list of projections for mongodb queries',
    name: 'projection',
    required: false,
    isArray: true,
    enum: Projection,
  })
  findAll(
    // todo - handle pagination
    @Req() request: Request,
    @Query('projection') projection: Projection | [Projection] | null,
    @Query('search') search: Partial<CreatePredictDto>
  ) {
    delete request.query.projection;
    return this.predictionsService.findAll(request.query, projection);
  }
}
