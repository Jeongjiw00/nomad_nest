import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 유효성검사
  // whitelist : 데코레이터가 없는 객체를 걸러줌.
  // forbidNonWhitelisted : 존재하지 않는 요소가 들어오면 에러 발생.
  // transform : 들어온 데이터를 우리가 실제 원하는 타입으로 변환.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
