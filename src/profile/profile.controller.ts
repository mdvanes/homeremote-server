import {
    Controller,
    Get,
    Logger,
    // Query,
    Request,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
// import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { User, UsersService } from "../users/users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

// const saltRounds = 10;
// const generateHash = (password: string): Promise<string> =>
//     bcrypt.hash(password, saltRounds);

@Controller("api/profile")
export class ProfileController {
    private readonly logger: Logger;

    constructor(private readonly usersService: UsersService) {
        this.logger = new Logger(ProfileController.name);
    }

    // Use this to show the "logged in as user"
    @UseGuards(JwtAuthGuard)
    @Get("current")
    async getProfile(@Request() req: AuthenticatedRequest): Promise<User> {
        this.logger.verbose(`current: ${JSON.stringify(req.user)}`);
        const user = await this.usersService.findOne(req.user.name);
        if (!user) {
            throw new UnauthorizedException();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }

    // Use to create a hash, because there is no "create new user" flow implemented
    // Should not have guard
    // @Get("gethash")
    // async getHash(@Query() query: { password: string }): Promise<string> {
    //     try {
    //         return generateHash(query.password);
    //     } catch (err) {
    //         this.logger.error(`Can't hash password ${err}`);
    //         return "";
    //     }
    // }
}
