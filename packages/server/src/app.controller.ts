import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello2')
  getHello2(): string {
    return 'Hello world 2';
  }

  // 서버 시작 시에 초기 데이터를 넣어 주는 api
  // 한 번 사용하고 나면 더이상 사용되지 않음
  @Get('/initialSetting')
  async getInitialSetting(): Promise<boolean> {
    return this.appService.initialSetting();
  }
}
