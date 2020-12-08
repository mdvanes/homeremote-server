import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";

describe("UsersService", () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("should return user object when user exists", async () => {
        expect(await service.findOne("john")).toEqual(
            expect.objectContaining({
                id: 1,
                name: "john",
                hash: expect.stringContaining("$2b$"),
            })
        );
    });

    it("should return undefined when user does not exist", async () => {
        expect(await service.findOne("bon")).toBeUndefined();
    });
});
