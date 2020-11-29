import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import youtubedl from 'youtube-dl';
import { ConfigService } from '@nestjs/config';
import id3 from 'id3-writer';

interface GetInfoBody {
  url: string;
}

interface FetchInfoReturned {
  title: string;
  artist: string;
}

interface GetMusicBody {
  url: string;
  title: string;
  artist: string;
  album: string;
}

interface FetchMusicReturned {
  path: string;
  fileName: string;
}

const getInfoPromise = (url: string): Promise<FetchInfoReturned> =>
  new Promise((resolve, reject) => {
    youtubedl.getInfo(url, (err, info: any) => {
      if (info && info.title && !err) {
        // Most of the time, info.title will be of the format %artist% - %title%
        const [artist, title] = info.title.split(' - ');
        resolve({ title, artist });
      } else {
        reject(new Error(`GetInfo failed: ${JSON.stringify(info)} - ${err}`));
      }
    });
  });

const getMusicPromise = (
  rootPath: string,
  url: string,
  artist: string,
  title: string,
): Promise<FetchMusicReturned> => {
  return new Promise((resolve, reject) => {
    let fileName = encodeURIComponent(url);
    if (artist && artist.length > 0 && title && title.length > 0) {
      fileName = `${artist} - ${title}`;
    }
    let targetPath = `${rootPath}/${fileName}`;
    // First send to mp4, mp3 is created with --extract-audio
    const args = [
      '-o',
      targetPath + '.mp4',
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--audio-quality',
      '0',
    ];
    // Extension is needed for setting metadata
    targetPath += '.mp3';
    fileName += '.mp3';
    youtubedl.exec(url, args, {}, (err, output: any) => {
      if (err) {
        reject(new Error(`GetMusic failed: ${url} ${err}`));
      } else {
        // console.log(output);
        resolve({ path: targetPath, fileName });
      }
    });
  });
};

const setMetadataPromise = (
  path: string,
  fileName: string,
  artist: string,
  title: string,
  album: string,
): Promise<FetchMusicReturned> => {
  return new Promise((resolve, reject) => {
    if (artist && artist.length > 0 && title && title.length > 0) {
      const file = new id3.File(path);
      const meta = new id3.Meta({ artist, title, album });
      const writer = new id3.Writer(); // In old implementation this was right after imports

      writer.setFile(file).write(meta, function (err: Error) {
        if (err) {
          reject('set metadata failed: ' + err);
        } else {
          resolve({ path, fileName });
        }
      });
    }
  });
};

@Controller('api/urltomusic')
export class UrltomusicController {
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(UrltomusicController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getinfo')
  async getInfo(
    @Body() { url }: GetInfoBody,
  ): Promise<FetchInfoReturned | { error: string }> {
    if (url) {
      this.logger.verbose(`Getting info for: ${url}`);
      return getInfoPromise(url);
    } else {
      throw new HttpException('url is required', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getmusic')
  async getMusic(
    @Body() { url, artist, title, album }: GetMusicBody,
  ): Promise<FetchMusicReturned | { error: string }> {
    if (url && artist && title && album) {
      this.logger.verbose(`Getting music for: ${url}`);
      const rootPath = this.configService.get<string>('URL_TO_MUSIC_ROOTPATH');
      if (!rootPath) {
        throw new HttpException(
          'rootPath not configured',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const { path, fileName } = await getMusicPromise(rootPath, url, artist, title);
      this.logger.verbose(`Got music for ${url} to ${fileName}`);
      const result = await setMetadataPromise( path, fileName, artist, title, album );
      this.logger.verbose(`Set metadata for ${fileName}`);
      return result;
    } else {
      // If Url not set, the error "not acceptable" is shown in the UI instead of "url is required"
      throw new HttpException(
        'url, artist, title, and album are required',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
