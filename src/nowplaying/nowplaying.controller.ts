import {
  Controller,
  Get,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
const {
  getNowPlaying,
  ChannelName,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('@mdworld/homeremote-stream-player-server');

interface NowPlayingResponse {
  artist: string;
  title: string;
  last_updated: string;
  songImageUrl: string;
  name: string;
  imageUrl: string;
}

@Controller('api/nowplaying')
export class NowplayingController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(NowplayingController.name);
  }

  // TODO the plugin does not support authentication yet!
  //   @UseGuards(JwtAuthGuard)
  @Get('radio2')
  async getRadio2(): Promise<NowPlayingResponse> {
    try {
      const response = await getNowPlaying(ChannelName.RADIO2);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('radio3')
  async getRadio3(): Promise<NowPlayingResponse> {
    try {
      const response = await getNowPlaying(ChannelName.RADIO3);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
