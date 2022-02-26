import { Module, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class BackendDocsModule {
  setup(app: INestApplication, prefix: string, title: string, desc: string) {
    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(desc)
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      // ignoreGlobalPrefix: true,
    });

    SwaggerModule.setup(prefix, app, document, {
      uiConfig: {},
      swaggerOptions: {},
    });
  }
}
