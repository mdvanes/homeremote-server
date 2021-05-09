import { Controller, Get, Logger, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transmission } from "@ctrl/transmission";
import { NormalizedTorrent } from "@ctrl/shared-torrent";
import prettyBytes from "pretty-bytes";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

type DownloadStatus = "paused" | "Stopped" | "Downloading";

interface DownloadItem {
    id: string;
    name: string;
    percentage: number;
    status: DownloadStatus;
    size: string;
}

type DownloadListResponse =
    | { status: "received"; downloads: DownloadItem[] }
    | { status: "error" };

const mapToDownloadItem = (item: NormalizedTorrent): DownloadItem => ({
    id: item.id.toString(),
    name: item.name,
    status: item.state === "paused" ? "Stopped" : "Downloading", // TODO map (some) other states: used for play button, so downloading/uploading/error?
    size: prettyBytes(item.totalSize),
    percentage: item.progress * 100,
});

@Controller("api/downloadlist")
export class DownloadlistController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(DownloadlistController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDownloadList(): Promise<DownloadListResponse> {
        const client = new Transmission({
            baseUrl: this.configService.get<string>("DOWNLOAD_BASE_URL") || "",
            username: this.configService.get<string>("DOWNLOAD_USERNAME") || "",
            password: this.configService.get<string>("DOWNLOAD_PASSWORD") || "",
        });

        try {
            const res = await client.getAllData();
            const downloads = res.torrents.map<DownloadItem>(mapToDownloadItem);

            return {
                status: "received",
                downloads,
            };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }
}
