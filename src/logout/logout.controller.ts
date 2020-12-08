import { Controller, Get, Logger, Req } from "@nestjs/common";
import { Request } from "express";
import { User } from "../users/users.service";
import { clearCookie } from "../auth/auth.service";

@Controller("auth/logout")
export class LogoutController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(LogoutController.name);
    }

    @Get()
    async logout(@Req() req: Request): Promise<User> {
        this.logger.verbose(`logout: ${JSON.stringify(req.user)}`);
        if (req.res) {
            req.res.clearCookie(...clearCookie);
        }
        return {
            id: 0,
            name: "",
            displayName: "",
        };
    }
}
