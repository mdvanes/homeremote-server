import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { DataloraController } from "./datalora.controller";

describe("Datalora Controller", () => {
    let controller: DataloraController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DataloraController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<DataloraController>(DataloraController);

        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "INFLUX_URL") {
                return "some.url";
            }
            if (envName === "INFLUX_TOKEN") {
                return "some.url";
            }
            if (envName === "INFLUX_ORG") {
                return "some.url";
            }
        });
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
