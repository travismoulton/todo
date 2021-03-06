import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/userRoutes';
import todoRouter from './routes/todoRoutes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  })
);

app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Set security http headers
app.use(helmet());

// Data sanitiziation against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(express.json());

app.use('/users', userRouter);
app.use('/todos', todoRouter);

export default app;
