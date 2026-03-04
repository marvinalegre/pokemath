import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.validation';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<Env, true>);

  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
}
bootstrap();
