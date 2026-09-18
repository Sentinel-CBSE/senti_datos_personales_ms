import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
  username: process.env.DB_USERNAME ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'senti_datos_personales_db',
  options: {
    encrypt: process.env.DB_ENCRYPT !== 'false',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  },
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});

export default AppDataSource;
