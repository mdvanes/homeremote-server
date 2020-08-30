import { Injectable } from '@nestjs/common';
import auth from '../../auth.json';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = auth.users;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(({ name }) => name === username);
  }
}