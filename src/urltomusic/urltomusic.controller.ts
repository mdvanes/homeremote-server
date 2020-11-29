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
        reject(new Error(`GetInfo failed: ${info} - ${err}`));
      }
    });
  });

const getMusicPromise = (rootPath: string, url: string, artist: string, title: string): Promise<FetchMusicReturned> => {
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
        console.log(output);
        // log.info('youtubedl.exec finished:', output);
        resolve({ path: targetPath, fileName });
      }
    });
  });
};

// const setMetadataPromise = (log, path, fileName, artist, title, album) => {
//   return new Promise((resolve, reject) => {
//       if(artist && artist.length > 0 && title && title.length > 0) {
//           const file = new id3.File(path);
//           const meta = new id3.Meta({ artist, title, album });

//           writer.setFile(file).write(meta, function(err) {
//               if (err) {
//                   reject('set metadata failed: ' + err);
//               } else {
//                   log.info('id3 finished');
//                   resolve({path, fileName});
//               }
//           });
//       }
//   });
// };

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
      // TODO implement get youtube
      this.logger.verbose(`Getting info for: ${url}`);

      // const { title, artist } = await getInfoPromise(url);

      // return { title: 'some title', artist: 'some artist' };
      return getInfoPromise(url);
    } else {
      // If Url not set, the error "not acceptable" is shown in the UI instead of "url is required"
      throw new HttpException('url is required', HttpStatus.NOT_ACCEPTABLE);
      // return { error: "url is required" }; // Return 200 OK, handle in client
    }

    // const statusCmd = this.configService.get<string>('STATUS_CMD') || '';
    // const statusField1 = this.configService.get<string>('STATUS_FIELD1') || '';
    // const statusField2 = this.configService.get<string>('STATUS_FIELD2') || '';
    // try {
    //   const json = await execToJson(statusCmd);
    //   return { status: `${json[statusField1]} ${json[statusField2]}` };
    // } catch (err) {
    //   this.logger.error(err);
    //   throw new HttpException("error", HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getmusic')
  async getMusic(
    @Body() { url, artist, title }: GetMusicBody,
  ): Promise<FetchMusicReturned | { error: string }> {
    if (url && artist && title) {
      this.logger.verbose(`Getting music for: ${url}`);
      const rootPath = this.configService.get<string>('URL_TO_MUSIC_ROOTPATH');
      if(!rootPath) {
        throw new HttpException('rootPath not configured', HttpStatus.NOT_ACCEPTABLE);
      }
      const result = await getMusicPromise(rootPath, url, artist, title);
      this.logger.verbose(`Got music for ${url} to ${result.fileName}`);
      // TODO implement set metadata
      return result;
    } else {
      // If Url not set, the error "not acceptable" is shown in the UI instead of "url is required"
      throw new HttpException('url, artist & title are required', HttpStatus.NOT_ACCEPTABLE);
      // return { error: "url is required" }; // Return 200 OK, handle in client
    }

    // const statusCmd = this.configService.get<string>('STATUS_CMD') || '';
    // const statusField1 = this.configService.get<string>('STATUS_FIELD1') || '';
    // const statusField2 = this.configService.get<string>('STATUS_FIELD2') || '';
    // try {
    //   const json = await execToJson(statusCmd);
    //   return { status: `${json[statusField1]} ${json[statusField2]}` };
    // } catch (err) {
    //   this.logger.error(err);
    //   throw new HttpException("error", HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }
}
