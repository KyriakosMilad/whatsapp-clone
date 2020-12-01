import express from 'express';

export default (
	fn: (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {}
) => (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => Promise.resolve(fn(req, res, next)).catch(next);
