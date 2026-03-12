import { Test, TestingModule } from '@nestjs/testing';
import { CatchController } from './catch.controller';

describe('CatchController', () => {
  let controller: CatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatchController],
    }).compile();

    controller = module.get<CatchController>(CatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
