import { Test, TestingModule } from '@nestjs/testing';
import { SwitchesController } from './switches.controller';

describe('Switches Controller', () => {
  let controller: SwitchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwitchesController],
    }).compile();

    controller = module.get<SwitchesController>(SwitchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
