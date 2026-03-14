import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { StringGeneratorService } from 'src/common/utils/string-generator.service';
import { DatabaseService } from 'src/database/database.service';
import { users } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { Logger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly stringGeneratorService: StringGeneratorService,
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async createGuest() {
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
          this.logger.error({ err }, 'Unexpected error during user creation');
          throw new InternalServerErrorException('Failed to create user');
        }

        jwtSub = this.stringGeneratorService.generate();
        username = `User_${this.stringGeneratorService.generate(5)}`;
      }
    }

    if (!result) {
      this.logger.error('Failed to create unique user after max retries');
      throw new InternalServerErrorException('Failed to create user');
    }

    const token = await this.jwtService.signAsync(
      { sub: jwtSub },
      {
        algorithm: 'HS256',
      },
    );

    return { username, token };
  }

  async getMe(jwtSub: string) {
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
