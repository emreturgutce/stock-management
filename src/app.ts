import 'colors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { session, corsOptions } from './config';
import { indexRouter } from './controllers';

const app = express();

app.use(express.static('public'))
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(morgan('dev'))
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

app.use(indexRouter);

export { app };
