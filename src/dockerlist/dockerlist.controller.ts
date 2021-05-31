import { Controller, Logger, UseGuards, Get, Param } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
    DockerListResponse,
    getDockerList,
    startContainer,
    stopContainer,
} from "@mdworld/homeremote-dockerlist-server";

@Controller("api/dockerlist")
export class DockerlistController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(DockerlistController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDockerList(): Promise<DockerListResponse> {
        this.logger.verbose("GET to /api/dockerlist");

        try {
            const res = await getDockerList();
            return res;
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("start/:id")
    async startContainer(@Param("id") id: string): Promise<DockerListResponse> {
        this.logger.verbose(`GET to /api/dockerlist/start ${id}`);

        try {
            const res = await startContainer(id);
            return res;
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("stop/:id")
    async stopContainer(@Param("id") id: string): Promise<DockerListResponse> {
        this.logger.verbose(`GET to /api/dockerlist/stop ${id}`);

        try {
            const res = await stopContainer(id);
            return res;
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }
}
