import { Controller, Get, Logger } from '@nestjs/common';

@Controller('api/foo')
export class FooController {
  private readonly logger;

  constructor() {
    this.logger = new Logger(FooController.name);
  }

  @Get()
  getMy(): string {
    console.log('GET to /api/foo');
    this.logger.error('GET to /api/foo');
    this.logger.warn('GET to /api/foo');
    this.logger.log('GET to /api/foo');
    this.logger.debug('GET to /api/foo');
    this.logger.verbose('GET to /api/foo');
    return "Foo!";// this.appService.getHello();
  }
}
