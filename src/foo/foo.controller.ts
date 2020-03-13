import { Controller, Get } from '@nestjs/common';

@Controller('api/foo')
export class FooController {
  @Get()
  getMy(): string {
    return "Foo!";// this.appService.getHello();
  }
}
