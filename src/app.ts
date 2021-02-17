import 'colors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { session, corsOptions } from './config';
import { indexRouter } from './controllers';
import { rateLimiter } from './middlewares';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(rateLimiter());
app.use(morgan('short'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

app.use(indexRouter);

export { app };
