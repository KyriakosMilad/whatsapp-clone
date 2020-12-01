import express from 'express';
import HttpException from '../utils/HttpException';

export default (
	err: HttpException,
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	// Log to console for dev
	console.log(err);

	// return error response
	res.status(err.statusCode || 500).json({
		success: false,
		error: err.message || 'Server error!',
	});
};
