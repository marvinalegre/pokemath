import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.validation';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  const configService = app.get(ConfigService<Env, true>);

  const port = configService.get('PORT', { infer: true });
  await app.listen(port);
}
bootstrap();
