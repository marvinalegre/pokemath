import { Test, TestingModule } from '@nestjs/testing';
import { StringGeneratorService } from './string-generator.service';

describe('StringGeneratorService', () => {
  let service: StringGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StringGeneratorService],
    }).compile();

    service = module.get<StringGeneratorService>(StringGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
