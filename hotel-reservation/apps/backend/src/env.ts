import {config} from 'dotenv';
import path from 'path';

type TypeMode = 'development' | 'production' | 'test';
const mode : TypeMode = process.env.NODE_ENV as TypeMode || 'development';

const envFile = `.env.${mode}`;
config({ path: path.join(__dirname,'environments', envFile) });

export const {
    PORT = 3000,
    NODE_ENV,
    BASE_URL,
    DB_HOST,
    DB_PORT = 'http://localhost:3000/api',
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_DIALECT,
    DB_STORAGE,
    DB_LOGGING,
    INIT_PASSWORD = '123456',
} = process.env;

export default {
    db : {
        host: DB_HOST || 'localhost',
        port: DB_PORT || 3306,
        username: DB_USERNAME || 'root',
        password: DB_PASSWORD || '',
        name: DB_NAME || 'test',
        dialect: DB_DIALECT || 'mysql',
        storage: DB_STORAGE || ':memory:',
        logging: DB_LOGGING || false,
    }
}
