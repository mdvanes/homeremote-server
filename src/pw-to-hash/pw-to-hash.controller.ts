import { Controller, Get, Logger, Query } from "@nestjs/common";
import bcrypt from "bcrypt";

const saltRounds = 10;
const generateHash = (password: string): Promise<string> =>
    bcrypt.hash(password, saltRounds);

@Controller("api/pw-to-hash")
export class PwToHashController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(PwToHashController.name);
    }

    // Use to create a hash, because there is no "create new user" flow implemented
    // Should not have a JwtAuthGuard
    // Steps:
    // - Enable in PwToHashController in app.module.ts
    // - http://localhost:3001/api/pw-to-hash/?password=test
    @Get()
    async getHash(@Query() query: { password: string }): Promise<string> {
        try {
            return generateHash(query.password);
        } catch (err) {
            this.logger.error(`Can't hash password ${err}`);
            return "";
        }
    }
}
