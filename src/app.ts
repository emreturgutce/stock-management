import express from 'express';
import cors from 'cors';
import session from './config/session';
import { indexRouter } from './controller';
import { corsOptions } from './config/cors-options';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

app.use(indexRouter);

export { app };
