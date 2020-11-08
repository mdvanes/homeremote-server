import { Controller, Get, HttpException, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/status')
export class StatusController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(StatusController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getStatus(): Promise<{ status: string }> {
    // return { status: 'Tabcdafaf Essfaafaa' };
    const error = new Error('fake error');
    this.logger.error(error);
    throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
  }
}
