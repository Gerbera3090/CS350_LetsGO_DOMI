import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  const corsOptions = {
    origin: ['https://localhost'],
    methods: ['GET', 'POST'],
    credentials: true,
  };
  app.setGlobalPrefix('/back');
  app.enableCors();
  // 쿠키 파서 설정
  app.use(cookieParser());

  // URL-encoded 형식의 요청 본문을 파싱 (NestJS에서는 기본적으로 지원됨)
  //app.use(express.urlencoded({ extended: true })); // 추가적인 설정이 필요하면 사용

  await app.listen(8001);
}
bootstrap();
