require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const centerError = require('./middlewares/center_error');
const router = require('./routers');
const { corsConfig } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NAME_DB } = require('./constants');
const { NODE_ENV, DB_URL } = process.env;

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

mongoose.connect(NODE_ENV === 'production' ? DB_URL : NAME_DB , {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use('*', cors(corsConfig));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(centerError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
