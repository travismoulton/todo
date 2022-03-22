import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!, Shutting donw...');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const { DATABASE, DB_PASSWORD, PORT } = process.env;

const DB: string = DATABASE?.replace('<password>', DB_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

const port = PORT || '8080';

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION, SHUTTING DOWN...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');

  server.close(() => {
    console.log('Proccess terminated');
  });
});
