import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import * as path from 'path';
import * as fs from 'fs';
// const fs = require('fs');
// import * as foo from './index.html';

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

    // TODO load without absolute path, should work in webpack
    const html = fs.readFileSync('/home/martin/ZNoBackup/homeremote-nestjs-server/src/login/index.html', 'utf-8');
    // const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
    return html;
//     return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <title>Login</title>
// </head>
// <body>
// Login
// </body>
// </html>`;
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    this.logger.verbose(`login: ${req.user}`);
    return this.authService.login(req.user);
  }
}
