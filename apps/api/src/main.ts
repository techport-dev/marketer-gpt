import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.use(
    json({
      limit: '50mb',
    }),
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(5000);
}
bootstrap();
