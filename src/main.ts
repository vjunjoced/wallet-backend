declare const module;
export const dbUrl: string = process.env.URL_MONGO;
console.log(dbUrl);


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 400,
      exceptionFactory: (errors: ValidationError[]) => {
        const rs = errors.map((el) => {
          return {
            property: el.property,
            validator: Object.keys(el.constraints)
          };
        });

        return {
          errors: rs,
          isErrorBadRequest: true
        };
      }
    })
  );
  app.enableCors({
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization']
  });
  app.use(helmet());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Powered-By', 'Junior Vasquez');
    next();
  });
  app.use(compression());
  
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
