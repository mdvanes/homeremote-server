import { Controller, Get, Logger, Req } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('auth/logout')
export class LogoutController {

    private readonly logger: Logger;

    constructor(private readonly authService: AuthService) {
      this.logger = new Logger(LogoutController.name);
    }

    @Get()
    async logout(@Req() req: any) {
      this.logger.verbose(`logout: ${JSON.stringify(req.user)}`);
      if (req.res) {
        req.res.setHeader('Set-Cookie', `Authentication=; HttpOnly; Path=/; Max-Age=10`);
      }
      return req.user;
    }

}
