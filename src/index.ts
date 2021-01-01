import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { createSession } from './config/session';
import { indexRouter } from './controller';
import { corsOptions } from './config/cors-options';

const app = express();

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json());
app.disable('x-powered-by');
app.use(createSession());

app.use(indexRouter);

app.listen(PORT, () => {
    console.log('App is running on port 8080');
});
