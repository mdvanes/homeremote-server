import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

declare const module: any;

// TODO
// Guard static files

const DEV_PORT = 3001; // Development
const PROD_PORT = 3200; // Production

async function bootstrap() {
    console.log("mode=", process.env.NODE_ENV);
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    app.use(cookieParser());
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        app.enableCors({
            // Access-Control-Allow-Headers
            allowedHeaders:
                "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
            // Access-Control-Allow-Credentials
            credentials: true,
            // Access-Control-Allow-Origin
            origin: "http://localhost:3000",
            // Access-Control-Allow-Methods
            methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
            optionsSuccessStatus: 204,
        });
        await app.listen(DEV_PORT);
    } else {
        await app.listen(PROD_PORT);
    }

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
