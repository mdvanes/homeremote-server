import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FooController } from './foo/foo.controller';


@Module({
  // Make sure no controller is bound to /, otherwise it will overwrite the static serving
  imports: [ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),],
  // controllers: [AppController, MyController, CatsController],
  controllers: [FooController, CatsController, FooController],
  providers: [AppService],
})
export class AppModule {}
