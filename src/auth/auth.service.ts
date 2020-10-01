import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginRequestUser } from '../login/login.controller';
import { User, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);
    try {
      if (!user) {
        throw new Error(`no user find for username ${username}`);
      }
      const isEqual = await bcrypt.compare(pass, user.hash);
      if (isEqual) {
        const { hash, ...userWithoutHash } = user;
        return userWithoutHash;
      }
    } catch (err) {
      this.logger.error(`Can't compare password to hash ${err}`);
    }
    return null;
  }

  async login({ id, name }: LoginRequestUser) {
    const payload = { sub: id, username: name };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }
}
