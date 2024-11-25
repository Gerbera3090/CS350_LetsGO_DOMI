import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('api-url')
  getApiUrl(): string {
    return this.appService.getApiUrl(); // 환경 변수를 반환하는 서비스 호출
  }
  @Get('api-url2')
  getApiUrl2(): string {
    return this.appService.getApiUrl(); // 환경 변수를 반환하는 서비스 호출
  }
}
