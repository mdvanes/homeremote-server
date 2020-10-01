import { Injectable } from '@nestjs/common';
import auth from '../../auth.json';

export interface StoredUser {
  id: number;
  name: string;
  hash: string;
}

export type User = Omit<StoredUser, "hash">;

@Injectable()
export class UsersService {
  private readonly users: StoredUser[];

  constructor() {
    this.users = auth.users;
  }

  async findOne(username: string): Promise<StoredUser | undefined> {
    return this.users.find(({ name }) => name === username);
  }
}
