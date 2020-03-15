import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/cats')
export class CatsController {

  @UseGuards(JwtAuthGuard)
  @Get()
  getMy(): string {
    return "Cats!";
  }
}
