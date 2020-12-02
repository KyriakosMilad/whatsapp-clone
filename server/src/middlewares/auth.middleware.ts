import asyncHandler from './asyncHandler.middleware';
import HttpException from '../utils/HttpException';
import { verifyJwt } from '../users/users.controller';

/**
 * @desc			Validate auth
 */
export default asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		// Set token from Bearer token in header
		token = req.headers.authorization.split(' ')[1];
	}

	// Make sure token exists
	if (!token) {
		return next(new HttpException('Not authorized to access this route', 401));
	}

	try {
		// verify token
		const authUser = await verifyJwt(token);

		// if token is invalid return error 401
		if (!authUser)
			return next(
				new HttpException('Not authorized to access this route', 401)
			);

		// set user in the request
		req.user = authUser;

		next();
	} catch (err) {
		return next(new HttpException('Not authorized to access this route', 401));
	}
});
