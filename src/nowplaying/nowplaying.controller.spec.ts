import {
    ChannelName,
    getNowPlaying,
} from "@mdworld/homeremote-stream-player-server";
import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "ts-jest/utils";
import { NowplayingController } from "./nowplaying.controller";
import got from "got";

jest.mock("@mdworld/homeremote-stream-player-server");
const mockGetNowPlaying = mocked(getNowPlaying, true); // not to have: getNowPlaying as unknown as jest.Mock<something>;

jest.mock("got");
const mockGot = mocked(got);

describe("Nowplaying Controller", () => {
    let controller: NowplayingController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NowplayingController],
        }).compile();

        controller = module.get<NowplayingController>(NowplayingController);

        mockGetNowPlaying.mockReset();
        mockGetNowPlaying.mockResolvedValue({
            title: "Some Title",
        } as any);
    });

    afterAll(() => {
        mockGetNowPlaying.mockRestore();
        mockGot.mockRestore();
    });

    it("returns radio 2 info on /GET", async () => {
        const response = await controller.getRadio2();
        expect(response?.title).toBe("Some Title");
        expect(mockGetNowPlaying).toBeCalledTimes(1);
        expect(mockGetNowPlaying).toBeCalledWith(ChannelName.RADIO2);
    });

    it("throws error on /GET radio 2 info failure", async () => {
        mockGetNowPlaying.mockRejectedValue(new Error("mock server error"));
        await expect(controller.getRadio2()).rejects.toThrow(
            "mock server error"
        );
    });

    it("returns radio 2 embed info on /GET", async () => {
        mockGot.mockReturnValue({
            text: () =>
                Promise.resolve(
                    "prefix='https://start-player.npo.nl/embed/foo'&suffix"
                ),
        } as any);

        const response = await controller.getRadio2Embed();
        expect(response).toBe("https://start-player.npo.nl/embed/foo");
    });

    it("returns radio 2 embed fallback on /GET when unrecognized format", async () => {
        mockGot.mockReturnValue({
            text: () =>
                Promise.resolve(
                    "prefix='https://start-FOOBAR-player.npo.nl/embed/foo'&suffix"
                ),
        } as any);

        const response = await controller.getRadio2Embed();
        expect(response).toBe("no-reponse");
    });

    it("throws error on /GET radio 2 embed failure", async () => {
        mockGot.mockReturnValue({
            text: () => Promise.reject("mock server error"),
        } as any);
        await expect(controller.getRadio2Embed()).rejects.toThrow(
            "mock server error"
        );
    });

    it("returns radio 3 info on /GET", async () => {
        const response = await controller.getRadio3();
        expect(response?.title).toBe("Some Title");
        expect(mockGetNowPlaying).toBeCalledTimes(1);
        expect(mockGetNowPlaying).toBeCalledWith(ChannelName.RADIO3);
    });
});
