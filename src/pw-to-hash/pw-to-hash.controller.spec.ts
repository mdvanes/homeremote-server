import { Test, TestingModule } from '@nestjs/testing';
import { PwToHashController } from './pw-to-hash.controller';

describe('PwToHashController', () => {
  let controller: PwToHashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PwToHashController],
    }).compile();

    controller = module.get<PwToHashController>(PwToHashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
