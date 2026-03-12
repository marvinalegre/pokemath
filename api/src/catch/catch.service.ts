import { Injectable } from '@nestjs/common';
import { generateAddition } from './generators/addition.generator';

@Injectable()
export class CatchService {
  getQuestion() {
    return generateAddition({ minSum: 1, maxSum: 10 });
  }
}
