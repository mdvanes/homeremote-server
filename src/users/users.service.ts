import { Injectable, Logger } from "@nestjs/common";
import auth from "../../auth.json";

export interface StoredUser {
    id: number;
    name: string;
    hash: string;
    displayName: string;
}

export type User = Omit<StoredUser, "hash">;

@Injectable()
export class UsersService {
    private readonly logger: Logger;
    private readonly users: StoredUser[];

    constructor() {
        this.logger = new Logger(UsersService.name);
        if (auth.users.length > 0) {
            this.logger.verbose(
                `Found auth config with ${auth.users.length} users`
            );
        } else {
            this.logger.error(`No auth config found`);
        }
        this.users = auth.users;
    }

    async findOne(username: string): Promise<StoredUser | undefined> {
        return this.users.find(({ name }) => name === username);
    }
}
