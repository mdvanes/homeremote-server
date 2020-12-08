import { Controller, Logger, Post, UseGuards, Req } from "@nestjs/common";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { AuthService } from "../auth/auth.service";
import { User } from "../users/users.service";
import { LoginRequest } from "./LoginRequest.types";

@Controller("auth/login")
export class LoginController {
    private readonly logger: Logger;

    constructor(private readonly authService: AuthService) {
        this.logger = new Logger(LoginController.name);
    }

    @UseGuards(LocalAuthGuard)
    @Post()
    async login(@Req() req: LoginRequest): Promise<User> {
        this.logger.verbose(`login: ${JSON.stringify(req.user)}`);

        /*
    Using the PassportJS strategy for Http-Only cookies adds the authentication token with each request automatically, which is conventient for an (Elm) plugin. See https://github.com/mdvanes/authentication-http-only-cors

    * The cookie is long-living (see auth.service.ts EXPIRES_IN_S), otherwise polling is needed
    * see also: https://github.com/mwanago/nestjs-typescript/blob/master/src/authentication/authentication.controller.ts

    TODO multi factor authentication with client side certificates
    * https://medium.com/@sevcsik/authentication-using-https-client-certificates-3c9d270e8326
    it is not needed to send the certificate manually, just to add it to the device browser once!
    * additionally, a password can/must be send
    * Document how to generate the certificates (for test and production separately)
    */
        const cookie = this.authService.getCookieWithJwtToken(req.user);
        if (req.res) {
            req.res.cookie(...cookie);
        }
        return req.user;
    }
}
