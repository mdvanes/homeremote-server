import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/urltomusic')
export class UrltomusicController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(UrltomusicController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getinfo')
  async getInfo(@Body() { url }: { url: string }): Promise<{ title: string }> {
    if (url) {
      // TODO implement get youtube
      this.logger.verbose(`Getting info for: ${url}`);
      return { title: 'some title' };
    } else {
      // If Url not set, the error "not acceptable" is shown in the UI instead of "url is required"
      throw new HttpException('url is required', HttpStatus.NOT_ACCEPTABLE);
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
