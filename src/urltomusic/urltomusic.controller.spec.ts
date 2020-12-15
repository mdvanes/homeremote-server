import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import youtubedl from "youtube-dl";
import id3 from "id3-writer";
import { UrltomusicController } from "./urltomusic.controller";

jest.mock("youtube-dl", () => {
    return {
        exec: jest.fn(),
        getInfo: jest.fn(),
    };
});

jest.mock("fs", () => {
    return {
        chmodSync: jest.fn(),
        chownSync: jest.fn(),
    };
});

const getInfoSpy = jest
    .spyOn(youtubedl, "getInfo")
    .mockImplementation((url, callback) => {
        callback(undefined, { title: "foo - bar" } as any);
    });

const execSpy = jest
    .spyOn(youtubedl, "exec")
    .mockImplementation((url, args, options, callback) =>
        callback(undefined, {} as any)
    );

jest.spyOn(id3, "File").mockImplementation((path) => `mock file ${path}`);

const writeSpy = jest.fn().mockImplementation((meta, callback) => {
    return callback(undefined);
});

const writerSpy = jest.spyOn(id3, "Writer").mockImplementation(() => ({
    setFile: (/* file */) => {
        return {
            write: writeSpy,
        };
    },
}));

describe("Urltomusic Controller", () => {
    let controller: UrltomusicController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrltomusicController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<UrltomusicController>(UrltomusicController);

        jest.spyOn(configService, "get").mockReturnValue("/some_path");
    });

    afterEach(() => {
        getInfoSpy.mockClear();
        execSpy.mockClear();
        writerSpy.mockClear();
        writeSpy.mockClear();
    });

    describe("getInfo POST", () => {
        it("splits title to artist and title", async () => {
            const result = await controller.getInfo({ url: "some_url" });
            expect(getInfoSpy).toHaveBeenCalledWith(
                "some_url",
                expect.anything()
            );
            expect(result).toEqual({
                artist: "foo",
                title: "bar",
                versionInfo: "undefined/bin unexpected state/undefined",
            });
        });

        it("falls back to only artist", async () => {
            getInfoSpy.mockImplementation((url, callback) => {
                callback(undefined, { title: "foo bar" } as any);
            });

            const result = await controller.getInfo({ url: "some_url" });
            expect(result).toEqual({
                artist: "foo bar",
                versionInfo: "undefined/bin unexpected state/undefined",
            });
        });

        it("throws error on remote error", async () => {
            getInfoSpy.mockImplementation((url, callback) => {
                callback(new Error("baz"), { title: "does not exist" } as any);
            });
            await expect(
                controller.getInfo({ url: "some_url" })
            ).rejects.toThrow(
                'GetInfo failed: {"title":"does not exist"} - Error: baz'
            );
        });
    });

    describe("getMusic POST", () => {
        it("returns a path when complete", async () => {
            const result = await controller.getMusic({
                url: "some_url",
                artist: "some_artist",
                title: "some_title",
                album: "some_album",
            });
            expect(execSpy).toHaveBeenCalledWith(
                "some_url",
                expect.arrayContaining([
                    "/some_path/some_artist - some_title.mp4",
                    "mp3",
                ]),
                {},
                expect.anything()
            );
            expect(writeSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    information: expect.objectContaining({
                        album: "some_album",
                    }),
                }),
                expect.anything()
            );
            expect(result).toEqual({
                fileName: "some_artist - some_title.mp3",
                path: "/some_path/some_artist - some_title.mp3",
            });
        });

        it("throws error on missing property", async () => {
            await expect(
                controller.getMusic({
                    url: "",
                    artist: "some_artist",
                    title: "some_title",
                    album: "some_album",
                })
            ).rejects.toThrow("url, artist, title, and album are required");
        });

        it("throws error when rootPath not configured", async () => {
            jest.spyOn(configService, "get").mockReturnValue(undefined);
            await expect(
                controller.getMusic({
                    url: "some_url",
                    artist: "some_artist",
                    title: "some_title",
                    album: "some_album",
                })
            ).rejects.toThrow("rootPath not configured");
        });

        it("throws error on remote error", async () => {
            execSpy.mockImplementation((url, args, options, callback) =>
                callback("URL DOES NOT EXIST", {} as any)
            );

            await expect(
                controller.getMusic({
                    url: "some_url",
                    artist: "some_artist",
                    title: "some_title",
                    album: "some_album",
                })
            ).rejects.toThrow("GetMusic failed: some_url URL DOES NOT EXIST");
        });
    });
});
