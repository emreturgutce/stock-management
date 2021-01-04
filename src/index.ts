import 'colors';
import { app } from './app';
import { PORT } from './config';

app.listen(PORT, () => {
    console.log(`🚀 App is running on port 8080`.blue);
});
