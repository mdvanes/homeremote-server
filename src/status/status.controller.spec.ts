import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { StatusController } from "./status.controller";

describe("Status Controller", () => {
    let controller: StatusController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StatusController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<StatusController>(StatusController);
    });

    it("returns the application status on /GET", async () => {
        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "STATUS_CMD") {
                return 'echo { \\"field1\\": \\"field1value\\" }';
            }
            return "field1";
        });
        const result = await controller.getStatus();
        expect(result).toEqual({ status: "field1value field1value" });
    });
});
