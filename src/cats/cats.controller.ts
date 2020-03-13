import { Controller, Get } from '@nestjs/common';

@Controller('api/cats')
export class CatsController {

  @Get()
  getMy(): string {
    return "Cats";
  }
}
