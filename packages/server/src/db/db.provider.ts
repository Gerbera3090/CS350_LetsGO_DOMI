import * as schema from './schema';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
export const DBAsyncProvider = 'dbProvider';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

export const DBProvider = [
  {
    provide: DBAsyncProvider,
    useFactory: async () => {
      config();
      const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } =
        process.env;
      const DB_URL = `mysql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
      Logger.log(DB_URL);
      const connection = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT), // 포트를 숫자로 변환
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        timezone: 'Z', // UTC 시간대로 설정
      });
      const db = drizzle(connection, { schema, mode: 'default' });
      return db;
    },
    exports: [DBAsyncProvider],
  },
];
