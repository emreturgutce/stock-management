import express from 'express';
import { indexRouter } from './controller';

const app = express();

app.use(express.json());
app.disable('x-powered-by');

app.use('/api', indexRouter);

app.listen(8080, () => {
    console.log('App is running on port 8080');
});
