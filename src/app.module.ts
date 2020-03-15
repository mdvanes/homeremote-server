import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FooController } from './foo/foo.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileController } from './profile/profile.controller';
import { LoginController } from './login/login.controller';

@Module({
  // TODO static serving should be guarded
  // Make sure no controller is bound to /, otherwise it will overwrite the static serving
  imports: [ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }), AuthModule, UsersModule,],
  // controllers: [AppController, MyController, CatsController],
  controllers: [CatsController, FooController, ProfileController, LoginController],
  providers: [AppService],
})
export class AppModule {}
