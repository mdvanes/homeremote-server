import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticatedRequest } from "src/login/LoginRequest.types";
import { StoredUser, UsersService } from "../users/users.service";
import { ProfileController } from "./profile.controller";

describe("Profile Controller", () => {
    let controller: ProfileController;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
                {
                    provide: UsersService,
                    useValue: { findOne: jest.fn() },
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        controller = module.get<ProfileController>(ProfileController);
    });

    it("returns the current user without hash on getProfile", async () => {
        const mockUser: StoredUser = {
            id: 1,
            name: "lee",
            displayName: "Stan",
            hash: "secret!",
        };

        jest.spyOn(usersService, "findOne").mockResolvedValue(mockUser);

        const result = await controller.getProfile({
            user: {
                id: mockUser.id,
                name: mockUser.name,
            },
        } as AuthenticatedRequest);

        const { id, name, displayName } = mockUser;
        expect(result).toEqual({
            id,
            name,
            displayName,
        });
    });

    it("throws error when no current user found on getProfile", async () => {
        jest.spyOn(usersService, "findOne").mockResolvedValue(undefined);

        const result = await expect(
            controller.getProfile({
                user: {
                    id: 2,
                    name: "test",
                },
            } as AuthenticatedRequest)
        ).rejects.toThrow();
        expect(result).toBeUndefined();
    });
});
