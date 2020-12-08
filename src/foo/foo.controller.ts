import { Controller, Get, Logger, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("api/foo")
export class FooController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(FooController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getFoo(): string {
        console.log("Console: GET to /api/foo");
        this.logger.error("Error: GET to /api/foo");
        this.logger.warn("Warning: GET to /api/foo");
        this.logger.log("Log: GET to /api/foo");
        this.logger.debug("Debug: GET to /api/foo");
        this.logger.verbose("Verbose: GET to /api/foo");
        return "Foo!";
    }
}
