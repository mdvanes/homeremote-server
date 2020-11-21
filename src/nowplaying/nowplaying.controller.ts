import {
  Controller,
  Get,
  Logger,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { getNowPlaying, ChannelName, NowPlayingResponse } from '@mdworld/homeremote-stream-player-server';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/nowplaying')
export class NowplayingController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(NowplayingController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('radio2')
  async getRadio2(): Promise<NowPlayingResponse | undefined> {
    try {
      const response = await getNowPlaying(ChannelName.RADIO2);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('radio3')
  async getRadio3(): Promise<NowPlayingResponse | undefined> {
    try {
      const response = await getNowPlaying(ChannelName.RADIO3);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
