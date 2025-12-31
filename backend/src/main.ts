import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable JSON body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`✅ Server running on http://localhost:${port}`);
}
bootstrap();
