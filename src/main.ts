import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppConfig from './etc/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('TUTOR TEST GRADING API')
    .setDescription('TUTOR TEST GRADING API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(AppConfig.PORT, () => {
    console.log(`Server listening on ${AppConfig.PORT}`);
  });
}
bootstrap();
