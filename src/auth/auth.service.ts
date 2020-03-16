import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

/*
TODO

Use bcrypt

WARNING
Of course in a real application, you wouldn't store a password in plain text. You'd instead use a library like bcrypt, with a salted one-way hash algorithm.
With that approach, you'd only store hashed passwords, and then compare the stored password to a hashed version of the incoming password, thus never storing
or exposing user passwords in plain text. To keep our sample app simple, we violate that absolute mandate and use plain text. Don't do this in your real app!
 */

@Injectable()
export class AuthService {
  private readonly logger;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    try {
      const isEqual = await bcrypt.compare(pass, user?.hash);
      if (isEqual) {
        const { hash, ...result } = user;
        return result;
      }
    } catch (err) {
      this.logger.error(`Can't compare password to hash ${err}`);
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }
}