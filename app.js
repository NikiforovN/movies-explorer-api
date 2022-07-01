require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { NotFound } = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.use(require('./routes/index'));

app.use('', auth, (_, res, next) => next(new NotFound()));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(3001);
