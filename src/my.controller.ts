import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// create a

@Controller('my')
export class MyController {
  constructor(/*private readonly appService: AppService*/) {}

  @Get()
  getMy(): string {
    return "My controller";// this.appService.getHello();
  }
}
