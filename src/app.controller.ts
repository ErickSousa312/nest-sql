import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('hello')
  getQuery() {
    return this.appService.Query();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
