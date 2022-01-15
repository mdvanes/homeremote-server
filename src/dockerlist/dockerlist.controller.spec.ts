import { Test, TestingModule } from "@nestjs/testing";
import { DockerlistController } from "./dockerlist.controller";
import { mocked } from "ts-jest/utils";
import {
    getDockerList,
    startContainer,
    stopContainer,
} from "@mdworld/homeremote-dockerlist-server";

jest.mock("@mdworld/homeremote-dockerlist-server");

const mockGetDockerList = mocked(getDockerList, true); // not to have: getDockerList as unknown as jest.Mock<getDockerList>;

describe("DockerList Controller", () => {
    let controller: DockerlistController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DockerlistController],
        }).compile();

        controller = module.get<DockerlistController>(DockerlistController);

        mockGetDockerList.mockReset();
        mockGetDockerList.mockResolvedValue({
            status: "received",
            containers: [],
        });

        // Example of strong typing on mock without ts-jest/utils
        (startContainer as jest.MockedFunction<
            typeof startContainer
        >).mockResolvedValue({
            status: "received",
        });

        (stopContainer as jest.MockedFunction<
            typeof stopContainer
        >).mockResolvedValue({
            status: "received",
        });
    });

    describe("getDockerList GET", () => {
        it("returns a list of running docker containers", async () => {
            const result = await controller.getDockerList();
            expect(mockGetDockerList).toBeCalledWith();
            expect(mockGetDockerList).toBeCalledTimes(1);
            expect(result).toEqual({
                status: "received",
                containers: [],
            });
        });

        it("returns an error if the library fails", async () => {
            mockGetDockerList.mockRejectedValue(new Error("some error"));
            const result = await controller.getDockerList();
            expect(mockGetDockerList).toBeCalledWith();
            expect(mockGetDockerList).toBeCalledTimes(1);
            expect(result).toEqual({
                status: "error",
            });
        });
    });

    describe("startContainer GET", () => {
        it("returns 'received' when succesful", async () => {
            const result = await controller.startContainer("123");
            expect(startContainer).toBeCalledWith("123");
            expect(startContainer).toBeCalledTimes(1);
            expect(result).toEqual({
                status: "received",
            });
        });
    });

    describe("stopContainer GET", () => {
        it("returns 'received' when succesful", async () => {
            const result = await controller.stopContainer("123");
            expect(stopContainer).toBeCalledWith("123");
            expect(stopContainer).toBeCalledTimes(1);
            expect(result).toEqual({
                status: "received",
            });
        });
    });
});
