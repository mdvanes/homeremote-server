import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import html from './login.html';

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

    // This only works with absolute paths, __dirname refers to `dist`
    // const html = fs.readFileSync('/some/absolute/path/homeremote-nestjs-server/src/login/index.html', 'utf-8');
    // const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
    return html;
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    this.logger.verbose(`login: ${req.user}`);
    return this.authService.login(req.user);
  }
}
