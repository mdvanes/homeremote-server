import {
    Controller,
    Get,
    Logger,
    HttpException,
    HttpStatus,
    UseGuards,
} from "@nestjs/common";
import {
    getNowPlaying,
    ChannelName,
    NowPlayingResponse,
} from "@mdworld/homeremote-stream-player-server";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import got from "got";

@Controller("api/nowplaying")
export class NowplayingController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(NowplayingController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get("radio2")
    async getRadio2(): Promise<NowPlayingResponse | undefined> {
        try {
            const response = await getNowPlaying(ChannelName.RADIO2);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("radio2embed")
    async getRadio2Embed(): Promise<string | undefined> {
        try {
            const r = await got("https://www.nporadio2.nl/live").text();
            const match = r.match(
                /https:\/\/start-player\.npo\.nl\/embed\/([^']*)'/
            );
            if (match) {
                const videoStreamEmbedUrl = `https://start-player.npo.nl/embed/${match[1]}`;
                return videoStreamEmbedUrl;
            }
            return "no-reponse";
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("radio3")
    async getRadio3(): Promise<NowPlayingResponse | undefined> {
        try {
            const response = await getNowPlaying(ChannelName.RADIO3);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
