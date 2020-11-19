import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User, UsersService } from '../users/users.service';

export const EXPIRES_IN_S = 30 * 24 * 60 * 60; // days * hours * minutes * seconds;

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

  public getCookieWithJwtToken({ id, name }: User): string {
    const payload = { sub: id, username: name };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${EXPIRES_IN_S}`; // Max-Age in seconds.
  }
}
