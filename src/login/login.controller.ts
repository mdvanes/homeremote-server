import { Controller, Logger, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/users/users.service';

interface LoginRequest extends Request {
  user: User;
}

@Controller('auth/login')
export class LoginController {
  private readonly logger: Logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(LoginController.name);
  }

  // Should not be guarded!
  // @Get()
  // getLoginPage(): string {
  //   this.logger.verbose('GET to /auth/login');

  //   // This only works with absolute paths, __dirname refers to `dist`
  //   // const html = fs.readFileSync('/some/absolute/path/homeremote-nestjs-server/src/login/index.html', 'utf-8');
  //   // const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  //   return html;
  // }

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req: LoginRequest): Promise<User> {
    this.logger.verbose(`login: ${JSON.stringify(req.user)}`);

    /*
    nestjs + passport + http only cookies
    Don't have to manually add Authentication header each api call?
    https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/

    see also: https://github.com/mwanago/nestjs-typescript/blob/master/src/authentication/authentication.controller.ts

    multi factor authentication with client side certificates
    https://medium.com/@sevcsik/authentication-using-https-client-certificates-3c9d270e8326
    it is not needed to send the certificate manually, just to add it to the device browser once!
    additionally, a password can/must be send

    // TODO document why (Don't have to manually add Authentication header each api call?, httponlycookie cant be read in client; 2 factor auth) and how (how generate certificates)
    // TODO document/generated certificates for test and prod separately
    // TODO do not invalidate after some time/(600s? just set to 30 days?) otherwise polling is needed - document that "expires" is set in auth.module.ts
    */
    const cookie = this.authService.getCookieWithJwtToken(req.user);
    if (req.res) {
      req.res.setHeader('Set-Cookie', cookie);
    }
    return req.user;
  }
}
