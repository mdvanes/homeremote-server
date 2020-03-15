import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/foo')
export class FooController {
  private readonly logger;

  constructor() {
    this.logger = new Logger(FooController.name);
  }

  // this is ending up at /api/foo/auth/login
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log(`login: ${req}`)
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
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
