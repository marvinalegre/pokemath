import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid/non-secure';

@Injectable()
export class StringGeneratorService {
  private readonly charset =
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  private readonly defaultGenerator = customAlphabet(this.charset, 21);

  generate(length?: number): string {
    if (length && length !== 21) {
      return customAlphabet(this.charset, length)();
    }

    return this.defaultGenerator();
  }
}
