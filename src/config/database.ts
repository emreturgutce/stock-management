import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'stock_management',
    password: 'postgres',
    port: 5432,
});

console.log('Connected to db');

export { pool };
