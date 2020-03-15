import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('auth/login')
export class LoginController {
  private readonly logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(LoginController.name);
  }

  // Should not be guarded!
  @Get()
  getFoo(): string {
    this.logger.verbose('GET to /auth/login');
    // TODO should serve the login page
    return "The Login Page";
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    this.logger.verbose(`login: ${req.user}`);
    return this.authService.login(req.user);
  }
}
