import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import youtubedl from 'youtube-dl';
import { UrltomusicController } from './urltomusic.controller';

const getInfoSpy = jest
  .spyOn(youtubedl, 'getInfo')
  .mockImplementation((url, callback) => {
    callback(undefined, { title: 'foo - bar' } as any);
  });

describe('Urltomusic Controller', () => {
  let controller: UrltomusicController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrltomusicController],
      providers: [{ provide: ConfigService, useValue: { get: jest.fn() } }],
    }).compile();

    controller = module.get<UrltomusicController>(UrltomusicController);

    jest.spyOn(configService, 'get').mockReturnValue('/some_path');
  });

  afterEach(() => {
    getInfoSpy.mockReset();
  });

  describe('getInfo POST', () => {
    it('splits title to artist and title', async () => {
      const result = await controller.getInfo({ url: 'some_url' });
      expect(getInfoSpy).toHaveBeenCalledWith('some_url', expect.anything());
      expect(result).toEqual({ artist: 'foo', title: 'bar' });
    });

    it('falls back to only artist', async () => {
      getInfoSpy.mockImplementation((url, callback) => {
        callback(undefined, { title: 'foo bar' } as any);
      });

      const result = await controller.getInfo({ url: 'some_url' });
      expect(result).toEqual({ artist: 'foo bar' });
    });

    it('throws error on remote error', async () => {
      getInfoSpy.mockImplementation((url, callback) => {
        callback(new Error('baz'), { title: 'does not exist' } as any);
      });
      await expect(controller.getInfo({ url: 'some_url' })).rejects.toThrow(
        'GetInfo failed: {"title":"does not exist"} - Error: baz',
      );
    });
  });
});
