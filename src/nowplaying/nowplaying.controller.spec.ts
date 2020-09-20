import { Test, TestingModule } from '@nestjs/testing';
import { NowplayingController } from './nowplaying.controller';

describe('Nowplaying Controller', () => {
  let controller: NowplayingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NowplayingController],
    }).compile();

    controller = module.get<NowplayingController>(NowplayingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
