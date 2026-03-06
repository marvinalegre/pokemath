import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.validation';
import { StringGeneratorService } from 'src/common/utils/string-generator.service';
import { DatabaseService } from 'src/database/database.service';
import { users } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly stringGeneratorService: StringGeneratorService,
    private readonly databaseService: DatabaseService,
  ) {}

  createGuest() {
    const MAX_RETRIES = 5;
    let jwtSub = this.stringGeneratorService.generate();
    let username = `User_${this.stringGeneratorService.generate(5)}`;
    let result = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        result = this.databaseService.db
          .insert(users)
          .values({ username, jwtSub })
          .returning({ id: users.id })
          .get();
        break;
      } catch (err) {
        if (!err.message.includes('UNIQUE constraint failed')) {
          // TODO: make a logger
          // this.logger.error('Unexpected error during user creation', err);
          throw new InternalServerErrorException('Failed to create user');
        }

        jwtSub = this.stringGeneratorService.generate();
        username = `User_${this.stringGeneratorService.generate(5)}`;
      }
    }

    if (!result) {
      // this.logger.error('Failed to create unique user after max retries');
      throw new InternalServerErrorException('Failed to create user');
    }

    const jwtSecret = this.configService.get('JWT_SECRET', { infer: true });

    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, sub: jwtSub },
      jwtSecret,
      {
        algorithm: 'HS256',
      },
    );

    return { username, token };
  }

  getMe(authHeader: string) {
    const token = authHeader.split(' ')[1];

    let jwtSub;
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get('JWT_SECRET', { infer: true }),
      );
      jwtSub = decoded.sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const result = this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.jwtSub, jwtSub as string))
      .all();

    if (result.length === 0) {
      throw new InternalServerErrorException('Something went wrong');
    } else if (result.length === 1) {
      return { username: result[0].username };
    } else {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
