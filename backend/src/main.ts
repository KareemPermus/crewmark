import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const exact = (process.env.CORS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const previewDomain = process.env.PREVIEW_DOMAIN ?? '';
  const localhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
  const previewHost =
    previewDomain && previewDomain !== 'localhost'
      ? new RegExp(`^https://[a-z0-9-]+\\.${previewDomain.replace(/\./g, '\\.')}$`)
      : null;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed =
        exact.includes(origin) || localhost.test(origin) || (previewHost?.test(origin) ?? false);
      return callback(null, allowed);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}
bootstrap();