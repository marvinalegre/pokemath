import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StringGeneratorService } from 'src/common/utils/string-generator.service';
import { DatabaseService } from 'src/database/database.service';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly stringGeneratorService: StringGeneratorService,
    private readonly db: DatabaseService,
  ) {}

  createGuest() {
    const MAX_RETRIES = 5;
    let jwtSub = this.stringGeneratorService.generate();
    let username = `User_${this.stringGeneratorService.generate(5)}`;
    let result = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        result = this.db.run(
          'INSERT INTO users (username, jwt_sub, role) VALUES (?, ?, ?)',
          [username, jwtSub, 'guest'],
        );
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

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (typeof jwtSecret === 'undefined') {
      throw new InternalServerErrorException();
    }

    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, sub: jwtSub },
      jwtSecret,
      {
        algorithm: 'HS256',
      },
    );

    return { username, token };
  }
}
