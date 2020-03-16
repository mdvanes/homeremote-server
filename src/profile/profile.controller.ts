import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import bcrypt from "bcrypt";
const saltRounds = 10;

@Controller()
export class ProfileController {

  // TODO Use this to show the "logged in as user"
  @UseGuards(JwtAuthGuard)
  @Get('api/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // Use to create a hash, because there is no "create new user" flow implemented
  // Should not have guard
  @Get('api/gethash')
  async getHash(@Query() query) {
    const hash = await bcrypt.hash(query.password, saltRounds);
    return hash;
  }
}
