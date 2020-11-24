import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

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

app.listen(PORT, () => {
	console.log(`Server is up and running on ${PORT}`);
});
