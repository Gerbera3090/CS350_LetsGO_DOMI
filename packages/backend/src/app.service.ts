import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }
  getApiUrl(): string {
    const apiUrl = this.configService.get<string>('NEXT_PUBLIC_API_URL');
    console.log('NEXT_PUBLIC_API_URL:', apiUrl); // 환경 변수 출력
    return `NEXT_PUBLIC_API_URL is ${apiUrl}`;
  }
}
