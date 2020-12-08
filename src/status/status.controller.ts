import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { exec } from "child_process";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const execToJson = (statusCmd: string): Promise<Record<string, string>> =>
    new Promise((resolve, reject) => {
        exec(statusCmd, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error ${error}`);
            }
            if (stderr) {
                reject(`exec stderr ${stderr}`);
            }
            try {
                const json = JSON.parse(stdout);
                resolve(json);
            } catch (err) {
                reject(`exec parse ${err}`);
            }
        });
    });

@Controller("api/status")
export class StatusController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(StatusController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getStatus(): Promise<{ status: string }> {
        const statusCmd = this.configService.get<string>("STATUS_CMD") || "";
        const statusField1 =
            this.configService.get<string>("STATUS_FIELD1") || "";
        const statusField2 =
            this.configService.get<string>("STATUS_FIELD2") || "";
        try {
            const json = await execToJson(statusCmd);
            return { status: `${json[statusField1]} ${json[statusField2]}` };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException("error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
