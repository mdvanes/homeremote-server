import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginRequest } from 'src/login/login.controller';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async login(user: LoginRequest["user"]) {
    const payload = { username: user.username, sub: user.userId };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }
}
