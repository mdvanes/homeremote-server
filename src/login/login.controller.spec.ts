import { Test, TestingModule } from "@nestjs/testing";
import { CookieOptions } from "express";
import { User } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { LoginController } from "./login.controller";
import { LoginRequest } from "./LoginRequest.types";

describe("Login Controller", () => {
    let controller: LoginController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            // to load the service with real implementation, use: providers: [AuthService],
            providers: [
                {
                    provide: AuthService,
                    useValue: { getCookieWithJwtToken: jest.fn() },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        controller = module.get<LoginController>(LoginController);
    });

    it("/POST returns a token for a user", async () => {
        const mockUser: User = {
            id: 1,
            name: "lee",
            displayName: "Stan",
        };

        const mockCookie: ["Authentication", string, CookieOptions] = [
            "Authentication",
            "some_token",
            {},
        ];

        jest.spyOn(authService, "getCookieWithJwtToken").mockReturnValue(
            mockCookie
        );

        const result = await controller.login({
            user: mockUser,
        } as LoginRequest);

        expect(authService.getCookieWithJwtToken).toHaveBeenCalledWith(
            mockUser
        );
        expect(result).toEqual(mockUser);
    });
});
