import { Pool } from 'pg';
import {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
} from '.';

class DatabaseClient {
    private static pool: Pool;

    static getInstance(): Pool {
        if (!DatabaseClient.pool) {
            DatabaseClient.pool = new Pool({
                user: POSTGRES_USER,
                host: POSTGRES_HOST,
                database: POSTGRES_DB,
                password: POSTGRES_PASSWORD,
                port: parseInt(POSTGRES_PORT, 10),
            });

            DatabaseClient.pool.once('connect', () => {
                console.log(`🐘 Connected to db`.blue);
            });

            DatabaseClient.pool.once('error', (err) => {
                console.log(`Error occurred connecting db: ${err}`.red);
            });

            DatabaseClient.pool.query('SELECT 1');
        }

        return DatabaseClient.pool;
    }
}

DatabaseClient.getInstance();

export { DatabaseClient };
