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

  it('returns radio 2 info on /GET', async () => {
    const response = await controller.getRadio2();
    expect(response?.title).toBeDefined();
    // expect(response.title).toBe("");
  });

  // it('does ? on /GET radio 2 info failure', async () => {
  //   // jest.spyOn(Stream, "getNowPlaying").mockRejectedValue("x");
  //   const response = await controller.getRadio2();
  //   expect(response).toEqual({});
  // });

  it('returns radio 3 info on /GET', async () => {
    const response = await controller.getRadio3();
    expect(response?.title).toBeDefined();
  });
});
