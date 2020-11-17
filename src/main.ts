import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

declare const module: any;

// TODO
// Guard static files

const DEV_PORT = 3001; // Development
const PROD_PORT = 3200; // Production

async function bootstrap() {
  console.log("mode=", process.env.NODE_ENV)
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.enableCors();
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
