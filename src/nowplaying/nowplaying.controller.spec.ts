import { Test, TestingModule } from '@nestjs/testing';
import { NowplayingController } from './nowplaying.controller';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Stream = require('@mdworld/homeremote-stream-player-server');

describe('Nowplaying Controller', () => {
  let controller: NowplayingController;
  // TODO this won't work, use dep injection in nowplaying.controller (see https://github.com/nestjs/nest/issues/191) - const mockGetNowPlaying = jest.spyOn(Stream, "getNowPlaying");

  beforeEach(async () => {
    // mockGetNowPlaying.mockResolvedValue({});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NowplayingController],
    }).compile();

    controller = module.get<NowplayingController>(NowplayingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/GET radio 2 info', async () => {
    const response = await controller.getRadio2();
    expect(response.title).toBeDefined();
    // expect(response.title).toBe("");
  });

  // it('does ? on /GET radio 2 info failure', async () => {
  //   // jest.spyOn(Stream, "getNowPlaying").mockRejectedValue("x");
  //   const response = await controller.getRadio2();
  //   expect(response).toEqual({});
  // });

  it('/GET radio 3 info', async () => {
    const response = await controller.getRadio3();
    expect(response.title).toBeDefined();
  });
});
