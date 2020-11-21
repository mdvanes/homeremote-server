import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';

describe('Status Controller', () => {
  let controller: StatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
    }).compile();

    controller = module.get<StatusController>(StatusController);
  });

  it('returns the application status on /GET', async () => {
    expect(controller).toBeDefined();
    const result = await controller.getStatus();
    expect(result).toEqual({ status: expect.stringContaining('Tabcdafaf') });
  });
});
