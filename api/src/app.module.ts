import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validate } from './env.validation';
import { LoggerModule } from 'nestjs-pino';
import { Env } from './env.validation';
import { PlayersModule } from './players/players.module';
import { CatchModule } from './catch/catch.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    AuthModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Env, true>) => ({
        pinoHttp: {
          transport:
            configService.get('NODE_ENV', { infer: true }) !== 'production'
              ? { target: 'pino-pretty' }
              : undefined,
          level: configService.get('LOG_LEVEL', { infer: true }) ?? 'info',
          redact: [
            'req.headers.cookie',
            'req.headers.authorization',
            'req.body.password',
          ],
        },
      }),
      inject: [ConfigService],
    }),
    PlayersModule,
    CatchModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
