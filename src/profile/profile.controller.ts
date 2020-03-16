import { Controller, Get, Logger, Query, Request, UseGuards } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
const saltRounds = 10;

@Controller()
export class ProfileController {
  private readonly logger;

  constructor() {
    this.logger = new Logger(ProfileController.name);
  }

  // Use this to show the "logged in as user"
  @UseGuards(JwtAuthGuard)
  @Get('api/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // Use to create a hash, because there is no "create new user" flow implemented
  // Should not have guard
  @Get('api/gethash')
  async getHash(@Query() query) {
    try {
      const hash = await bcrypt.hash(query.password, saltRounds);
      return hash;
    } catch (err) {
      this.logger.error(`Can't hash password ${err}`);
    }
  }
}
