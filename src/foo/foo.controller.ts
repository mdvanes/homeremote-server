import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/foo')
export class FooController {
  private readonly logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(FooController.name);
  }

  // TODO extract to /login controller
  // this is ending up at /api/foo/auth/login
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log(`login: ${req.user}`);
    return this.authService.login(req.user);
  }

  // TODO extract to /api/profile and use this to show the "logged in as user"
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
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
    return "Foo!";// this.appService.getHello();
  }
}
