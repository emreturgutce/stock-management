import { Pool } from 'pg';
import {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
} from '.';

const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: parseInt(POSTGRES_PORT, 10),
});

console.log('🐒 Connected to db');

export { pool };
