import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

type DownloadStatus = "Stopped" | "Downloading";

interface DownloadItem {
    id: number;
    name: string;
    percentage: number;
    status: DownloadStatus;
    size: string;
}

type DownloadListResponse =
    | { status: "received"; downloads: DownloadItem[] }
    | { status: "error" };

@Controller("api/downloadlist")
export class DownloadlistController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(DownloadlistController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDownloadList(): Promise<DownloadListResponse> {
        // const statusCmd = this.configService.get<string>("STATUS_CMD") || "";
        // const statusField1 =
        //     this.configService.get<string>("STATUS_FIELD1") || "";
        // const statusField2 =
        //     this.configService.get<string>("STATUS_FIELD2") || "";
        try {
            // const json = await execToJson(statusCmd);
            return {
                status: "received",
                downloads: [
                    {
                        id: 1,
                        name: "Some Name",
                        percentage: 10,
                        status: "Downloading",
                        size: "100 kB",
                    },
                    {
                        id: 2,
                        name: "File 2",
                        percentage: 100,
                        status: "Stopped",
                        size: "1.2TB",
                    },
                ],
            };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }
}
