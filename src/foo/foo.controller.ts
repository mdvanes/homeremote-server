import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/foo')
export class FooController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(FooController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getFoo(): string {
    console.log('GET to /api/foo');
    this.logger.error('GET to /api/foo');
    this.logger.warn('GET to /api/foo');
    this.logger.log('GET to /api/foo');
    this.logger.debug('GET to /api/foo');
    this.logger.verbose('GET to /api/foo');
    return 'Foo!';
  }
}
