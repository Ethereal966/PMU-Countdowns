import 'dotenv/config';
import express from 'express';
import logger from './utils/logger';
import dates from './routes/dates';
import { join } from 'path';

const app = express();

app.use(express.json());
app.use('/dates', dates);
app.use(express.static(join(__dirname, '../src/public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../src/public/index.html'));
});

app.listen(process.env.PORT, () => logger.info(`Server is running on port ${process.env.PORT}`));