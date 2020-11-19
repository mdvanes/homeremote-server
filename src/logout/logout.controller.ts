import { Controller, Get, Logger, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users/users.service';
import { AuthService, EXPIRES_IN_S } from '../auth/auth.service';

@Controller('auth/logout')
export class LogoutController {
  private readonly logger: Logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(LogoutController.name);
  }

  @Get()
  async logout(@Req() req: Request): Promise<User> {
    this.logger.verbose(`logout: ${JSON.stringify(req.user)}`);
    if (req.res) {
      req.res.setHeader(
        'Set-Cookie',
        `Authentication=; HttpOnly; Path=/; ${EXPIRES_IN_S}`, // Max-Age in seconds.
      );
    }
    return {
      id: 0,
      name: '',
    };
  }
}
