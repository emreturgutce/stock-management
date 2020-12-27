import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { createSession } from './config/session';
import { indexRouter } from './controller';
import { errorHandler } from './middleware/error-handler';
import { notFound } from './middleware/not-found';

const app = express();

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');
app.use(createSession());

app.use('/api', indexRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log('App is running on port 8080');
});
