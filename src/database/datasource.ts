import AppConfig from '../etc/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  port: AppConfig.DB_PORT,
  host: AppConfig.DB_HOST,
  username: AppConfig.DB_USERNAME,
  password: AppConfig.DB_PASSWORD,
  database: AppConfig.DATABASE_NAME,
  entities: [path.resolve(__dirname + '/../**/*.entity.{js,ts}')],
  migrations: [path.resolve(__dirname + '/../migrations/*.{js,ts}')],
  logger: 'advanced-console',
  logging: 'all',
});
export default AppDataSource;
