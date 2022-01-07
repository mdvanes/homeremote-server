import { Test, TestingModule } from '@nestjs/testing';
import { DataloraController } from './datalora.controller';

describe('DataloraController', () => {
  let controller: DataloraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataloraController],
    }).compile();

    controller = module.get<DataloraController>(DataloraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
