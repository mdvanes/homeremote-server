import {
  Controller,
  Get,
  Logger,
  // Query,
  Request,
  UseGuards,
} from '@nestjs/common';
// import bcrypt from 'bcrypt';
import { LoginRequest } from '../login/LoginRequest.types';
import { User } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// const saltRounds = 10;
// const generateHash = (password: string): Promise<string> => bcrypt.hash(password, saltRounds);

@Controller('api/profile')
export class ProfileController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(ProfileController.name);
  }

  // Use this to show the "logged in as user"
  @UseGuards(JwtAuthGuard)
  @Get('current')
  getProfile(@Request() req: LoginRequest): User {
    return req.user;
  }

  // Use to create a hash, because there is no "create new user" flow implemented
  // Should not have guard
  // @Get('gethash')
  // async getHash(@Query() query: { password: string }): Promise<string> {
  //   try {
  //     return generateHash(query.password);
  //   } catch (err) {
  //     this.logger.error(`Can't hash password ${err}`);
  //     return "";
  //   }
  // }
}
