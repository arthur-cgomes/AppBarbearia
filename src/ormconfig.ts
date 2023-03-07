import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import './envs';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true' ? true : false,
  autoLoadEntities: true,
};
