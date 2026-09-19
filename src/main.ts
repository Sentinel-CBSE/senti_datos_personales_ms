import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sin esto, Nest ignora SIGTERM y ACA mata el contenedor sin darle chance
  // de cerrar el pool de conexiones a SQL Server (onModuleDestroy de TypeORM).
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SENTI - Datos Personales MS')
    .setDescription(
      'Microservicio encargado de la gestion de datos personales, informacion medica basica ' +
        'y contactos de emergencia dentro del sistema SENTI de reporte de robos.',
    )
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  // La spec OpenAPI se sirve en /openapi.json (ademas de la UI en /docs) para que
  // Azure Container Apps / API Management la descubran automaticamente por
  // convencion de path. @nestjs/swagger siempre genera OpenAPI 3.0.0.
  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'openapi.json',
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}

bootstrap();
