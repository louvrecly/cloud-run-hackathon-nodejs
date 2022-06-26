import express from 'express';
import bodyParser from 'body-parser';
import router from './server/routes';
import logger from './server/middleware/logger';
import requestValidator from './server/middleware/requestValidator';

const app = express();

app.use(bodyParser.json());
app.use(logger);
app.use(requestValidator);

app.use('/', router);

app.listen(process.env.PORT || 8080);

export default app;
