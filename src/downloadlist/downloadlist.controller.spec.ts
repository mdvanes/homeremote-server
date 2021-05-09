import { Test, TestingModule } from '@nestjs/testing';
import { DownloadlistController } from './downloadlist.controller';

describe('Downloadlist Controller', () => {
  let controller: DownloadlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadlistController],
    }).compile();

    controller = module.get<DownloadlistController>(DownloadlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
