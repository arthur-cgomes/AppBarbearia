/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const version = require('../package.json').version;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const options = new DocumentBuilder()
    .setTitle(`App Barbearia`)
    .setDescription('Back-end do projeto App Barbearia')
    .setVersion(version)
    .addBearerAuth()
    .addTag('Endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const PORT = Number(process.env.PORT) || 3000;

  await app.listen(PORT, '0.0.0.0');
  console.log(
    `💈app barbearia is in ${process.env.NODE_ENV} mode and is listening on port:`,
    PORT,
  );
}
bootstrap();
