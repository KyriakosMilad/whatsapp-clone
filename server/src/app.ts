import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

const PORT = process.env.PORT;

app.use(
	(
		err: Error,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		res.status(500).json({
			message: err.message,
		});
	}
);

const server = app.listen(PORT, () => {
	console.log(`Server is up and running on ${PORT}`);
});

process.on('unhandledRejection', (err: Error, promise) => {
	console.log(`Error: ${err.message}`);
	server.close(() => process.exit(1));
});
