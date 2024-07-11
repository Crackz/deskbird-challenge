import { ShutdownSignal } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './common/env/environment-variables';
import { DefaultValidationPipe } from './common/pipes/default-validation.pipe';
import { OpenApi } from './common/utils/open-api';
import { HttpExceptionsFilter } from './common/filters/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const serverPort = configService.get('SERVER_PORT');

  OpenApi.setup('/docs', app);

  app.enableCors();
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new DefaultValidationPipe());
  app.useGlobalFilters(new HttpExceptionsFilter());

  app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);

  await app.listen(serverPort);
}
bootstrap();
