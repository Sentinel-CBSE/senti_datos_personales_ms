import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
  username: process.env.DB_USERNAME ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'senti_datos_personales_db',
  encrypt: process.env.DB_ENCRYPT !== 'false',
  trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
}));
