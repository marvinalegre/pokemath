import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { generateAddition } from './generators/addition.generator';
import { PlayersService } from 'src/players/players.service';
import { DatabaseService } from 'src/database/database.service';
import { catchQuestions } from 'src/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CatchService {
  constructor(
    private readonly playersService: PlayersService,
    private readonly databaseService: DatabaseService,
  ) {}

  getQuestion(jwtSub: string) {
    const user = this.playersService.findBySub(jwtSub);
    if (!user) throw new UnauthorizedException();

    const savedQuestion = this.findSavedQuestion(user.id);

    if (savedQuestion) {
      return { question: savedQuestion };
    } else {
      const { question, answer } = generateAddition({ minSum: 1, maxSum: 10 });
      this.saveQuestion(user.id, question, answer);
      return { question };
    }
  }

  findSavedQuestion(userId: number) {
    const question = this.databaseService.db
      .select()
      .from(catchQuestions)
      .where(eq(catchQuestions.userId, userId))
      .get();
    if (!question) {
      return null;
    } else {
      return question.question;
    }
  }

  saveQuestion(userId: number, question: string, answer: string) {
    const result = this.databaseService.db
      .insert(catchQuestions)
      .values({ userId, question, answer })
      .returning({ id: catchQuestions.id })
      .get();

    if (!result) {
      throw new InternalServerErrorException('Failed to save question');
    }
  }
}
