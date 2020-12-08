import { Test, TestingModule } from "@nestjs/testing";
import { LoginRequest } from "../login/LoginRequest.types";
import { User } from "../users/users.service";
import { LogoutController } from "./logout.controller";

describe("Logout Controller", () => {
    let controller: LogoutController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogoutController],
        }).compile();

        controller = module.get<LogoutController>(LogoutController);
    });

    it("logs out the user on GET", async () => {
        const mockUser: User = {
            id: 1,
            name: "lee",
            displayName: "Stan",
        };
        expect(controller).toBeDefined();
        const result = await controller.logout({
            user: mockUser,
        } as LoginRequest);
        expect(result).toEqual({
            id: 0,
            name: "",
            displayName: "",
        });
    });
});
