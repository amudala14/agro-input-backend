import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ResponseTransformInterceptor } from './common/interceptors/responseTransform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const message = errors
          .map((error) => Object.values(error.constraints).join(', '))
          .join('; ');
        return new BadRequestException(message);
      },
    }),
  );

  // Global Interceptor
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(5001);
}
bootstrap();
