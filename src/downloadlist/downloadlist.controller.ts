import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    ParseIntPipe,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transmission } from "@ctrl/transmission";
import { NormalizedTorrent, TorrentState } from "@ctrl/shared-torrent";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
    DownloadItem,
    SimpleDownloadState,
} from "../api-types/downloadlist.types";

type DownloadListResponse =
    | { status: "received"; downloads: DownloadItem[] }
    | { status: "error" };

type DownloadToggleResponse =
    | { status: "received"; message: string }
    | { status: "error" };

const stateToSimpleState: Record<TorrentState, SimpleDownloadState> = {
    downloading: "downloading",
    seeding: "downloading",
    queued: "downloading",
    checking: "downloading",
    paused: "paused",
    error: "invalid",
    unknown: "invalid",
};

const mapToDownloadItem = (item: NormalizedTorrent): DownloadItem => ({
    id: typeof item.id === "number" ? item.id : 0, // TODO just throw an error when item.id is not a number.
    name: item.name,
    state: item.state,
    simpleState: stateToSimpleState[item.state],
    size: prettyBytes(item.totalSize),
    percentage: Math.round(item.progress * 100),
    downloadSpeed: prettyBytes(item.downloadSpeed),
    uploadSpeed: prettyBytes(item.uploadSpeed),
    eta: item.eta > 0 ? prettyMs(item.eta * 1000, { compact: true }) : "",
});

const wait = (ms: number) =>
    new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });

@Controller("api/downloadlist")
export class DownloadlistController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(DownloadlistController.name);
    }

    getClient(): Transmission {
        const client = new Transmission({
            baseUrl: this.configService.get<string>("DOWNLOAD_BASE_URL") || "",
            username: this.configService.get<string>("DOWNLOAD_USERNAME") || "",
            password: this.configService.get<string>("DOWNLOAD_PASSWORD") || "",
        });
        return client;
    }

    @UseGuards(JwtAuthGuard)
    @Get("pauseDownload/:id")
    async pauseDownload(
        @Param("id", new ParseIntPipe()) id: number
    ): Promise<DownloadToggleResponse> {
        this.logger.verbose(`GET to /api/downloadlist/pauseDownload: ${id}`);
        const client = this.getClient();

        try {
            const res = await client.pauseTorrent(id);
            // Response is so fast that getDownloadList will not be updated yet (see resumeDownload function)
            await wait(500);
            return {
                status: "received",
                message: res.result,
            };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("resumeDownload/:id")
    async resumeDownload(
        @Param("id", new ParseIntPipe()) id: number
    ): Promise<DownloadToggleResponse> {
        this.logger.verbose(`GET to /api/downloadlist/resumeDownload: ${id}`);
        const client = this.getClient();

        try {
            const res = await client.resumeTorrent(id);
            // A delay is added because the call to downloadlist is done so fast after resumeDownload, that the server did not yet
            // finish changing the status to resumed.
            // Why is this not an issue in the old implementation (with RTK but not RTKQ)? There is over 1s between the resumedownload and the get downloadlist calls!
            // There used to be a 1s delay in the client for that.
            await wait(500);
            return {
                status: "received",
                message: res.result,
            };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDownloadList(): Promise<DownloadListResponse> {
        this.logger.verbose("GET to /api/downloadlist");
        const client = this.getClient();

        try {
            const res = await client.getAllData();
            const downloads = res.torrents.map<DownloadItem>(mapToDownloadItem);

            return {
                status: "received",
                downloads,
            };
        } catch (err) {
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
