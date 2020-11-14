import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FooController } from './foo/foo.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileController } from './profile/profile.controller';
import { LoginController } from './login/login.controller';
import { SwitchesController } from './switches/switches.controller';
import { NowplayingController } from './nowplaying/nowplaying.controller';
import { StatusController } from './status/status.controller';
import { LogoutController } from './logout/logout.controller';

@Module({
  // TODO static serving should be guarded see https://docs.nestjs.com/techniques/mvc
  // Make sure no controller is bound to /, otherwise it will overwrite the static serving
  imports: [ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }), AuthModule, UsersModule],
  // controllers: [AppController,
  controllers: [FooController, ProfileController, LoginController, SwitchesController, NowplayingController, StatusController, LogoutController],
  providers: [AppService],
})
export class AppModule {}
