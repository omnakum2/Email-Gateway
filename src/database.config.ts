import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from './Modules/User/UserEntity';
import { ApiKeyEntity } from './Modules/ApiKey/ApiKeyEntity';
import * as dotenv from 'dotenv';

dotenv.config();

const isLocal = process.env.NODE_ENV === 'local';

const dbConfig: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  database: process.env.DB_NAME,
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  entities: [UserEntity, ApiKeyEntity],
  synchronize: isLocal,
};

export const AppDataSource = new DataSource(dbConfig);