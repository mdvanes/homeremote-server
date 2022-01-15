import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Query,
} from "@nestjs/common";
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
        if (process.env.NODE_ENV === "DEVELOPMENT") {
            try {
                if (query.password && query.password.length > 0) {
                    return generateHash(query.password);
                } else {
                    throw Error("Invalid params");
                }
            } catch (err) {
                this.logger.error(`Can't hash password ${err}`);
                throw new HttpException(
                    "Invalid params",
                    HttpStatus.BAD_REQUEST
                );
            }
        } else {
            this.logger.error("Only allow this endpoint in development mode");
            // Throw 418, because "Some websites use this response for requests they do not wish to handle, such as automated queries" source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
            throw new HttpException("Refused", HttpStatus.I_AM_A_TEAPOT);
        }
    }
}
