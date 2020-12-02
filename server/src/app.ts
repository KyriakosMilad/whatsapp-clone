import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import errorHandler from './middlewares/errorHandler.middleware';

// get config.env vars into process.env
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// routes files
import UsersRoutes from './users/users.routes';

const app = express();

// body parser
app.use(express.json());

const PORT = process.env.PORT!;

// mount routes
app.use('/api', UsersRoutes);

// handle error
app.use(errorHandler);

// start the server
const server = app.listen(PORT, (): void => {
	console.log(`Server is up and running on ${PORT}`);
});

// handle unhandled rejection
process.on('unhandledRejection', (err: Error) => {
	console.log(`Error: ${err.message}`);
	server.close(() => process.exit(1));
});
