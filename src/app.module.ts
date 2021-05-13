import { Module } from "@nestjs/common";
// import { AppController } from './app.controller';
import { AppService } from "./app.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import * as Joi from "@hapi/joi";
import { ConfigModule } from "@nestjs/config";
import { FooController } from "./foo/foo.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProfileController } from "./profile/profile.controller";
import { LoginController } from "./login/login.controller";
import { SwitchesController } from "./switches/switches.controller";
import { NowplayingController } from "./nowplaying/nowplaying.controller";
import { StatusController } from "./status/status.controller";
import { LogoutController } from "./logout/logout.controller";
import { UrltomusicController } from "./urltomusic/urltomusic.controller";
import { DownloadlistController } from "./downloadlist/downloadlist.controller";

// TODO replace package.json copy in in "build" by assets setting in nest-cli.json, see https://docs.nestjs.com/cli/monorepo#assets
// Nest CLI does not automatically move your "assets" (non-TS files) to the dist folder during the build process. To make sure that your YAML files are being moved as part of the compilation, add compilerOptions#assets to the nest-cli.json configuration file ("assets": ["**/*.yml"]). Read more here.

// TODO ConfigModule can also use a yaml instead of a .env file

@Module({
    // TODO static serving should be guarded see https://docs.nestjs.com/techniques/mvc
    // Make sure no controller is bound to /, otherwise it will overwrite the static serving
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "client"),
        }),
        AuthModule,
        UsersModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                STATUS_CMD: Joi.string().default("echo 'test status cmd'"),
                SOME_VAR: Joi.string().required,
            }),
        }),
    ],
    // controllers: [AppController,
    controllers: [
        FooController,
        ProfileController,
        LoginController,
        SwitchesController,
        NowplayingController,
        StatusController,
        LogoutController,
        UrltomusicController,
        DownloadlistController,
    ],
    providers: [AppService],
})
export class AppModule {}
