import { RequestHandler } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware';
import UserSchema from './users.schema';
import twilio from 'twilio';
import HttpException from '../utils/HttpException';
import jwt from 'jsonwebtoken';
import { IUser } from './users.schema';
import parsePhoneNumberFromString from 'libphonenumber-js';

const twilioClient = twilio(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

/**
 * @desc			Create new user
 * @access		DEV METHOD
 */
export const createUser = async (
	phoneNumber: string
): Promise<IUser | undefined> => {
	try {
		// create user
		return await UserSchema.create({ phoneNumber: phoneNumber });
	} catch {
		return undefined;
	}
};

/**
 * @desc			Find user by id
 * @access		DEV METHOD
 */
export const findUserById = async (id: string): Promise<IUser | undefined> => {
	try {
		// find user
		const user = await UserSchema.findById(id);

		// if user not found return undefined
		if (!user) return undefined;

		return user;
	} catch {
		return undefined;
	}
};

/**
 * @desc			Find user by phone number
 * @access		DEV METHOD
 */
export const findUserByPhoneNumber = async (
	phoneNumber: string
): Promise<IUser | undefined> => {
	try {
		// find user
		const user = await UserSchema.findOne({ phoneNumber: phoneNumber });

		// if user not found return undefined
		if (!user) return undefined;

		return user;
	} catch {
		return undefined;
	}
};

/**
 * @desc			Send verification code and create user if first time
 * @access		PUBLIC
 */
export const signIn: RequestHandler = asyncHandler(async (req, res, next) => {
	// parse phone number
	const parsedPhoneNumber = parsePhoneNumberFromString(req.body.phoneNumber)!;

	// get user using phone number
	let user = await findUserByPhoneNumber(String(parsedPhoneNumber.number));

	// check if user created before, if not create new
	if (!user) {
		user = await createUser(String(parsedPhoneNumber.number));
		if (!user) return next(new HttpException('Server error!', 500));
	}

	// update user set auth code
	const authCode = Math.floor(100000 + Math.random() * 900000);
	await user.updateOne({
		authCode: authCode,
	});

	// send auth code via sms
	return twilioClient.messages
		.create({
			body: `Your whatsapp-clone auth code: ${authCode}`,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: user!.phoneNumber,
		})
		.then((message) => {
			return res.status(200).json({
				success: true,
				message: 'Auth code sent successfully to your phone number',
			});
		})
		.catch((err) => {
			console.log(err);
			return next(
				new HttpException(
					'Unexpected error occurred when try to send request to messaging server, try again later',
					500
				)
			);
		});
});

/**
 * @desc			Verify auth code and generate jwt
 * @access		PUBLIC
 */
export const verifyAuthCode: RequestHandler = asyncHandler(
	async (req, res, next) => {
		// parse phone number
		const parsedPhoneNumber = parsePhoneNumberFromString(req.body.phoneNumber)!;

		// get user by phone number
		const user = await findUserByPhoneNumber(String(parsedPhoneNumber.number));

		// check if user exist
		if (!user)
			return next(new HttpException('Phone number does not exist', 422));

		// check if auth code sent equals auth code exist on database
		if (user.authCode !== req.body.authCode)
			return next(new HttpException('Auth code is wrong', 422));

		// update auth code set to null
		await user.updateOne({ authCode: null });

		// generate jwt and send it to user
		res.status(200).json({
			success: true,
			jwt: jwt.sign(
				{
					userId: user._id.toString(),
				},
				process.env.JWT_SECRET!
			),
			authId: user._id.toString(),
		});
	}
);

/**
 * @desc			Check if jwt is valid
 * @access		DEV METHOD
 */
export const verifyJwt = async (token: string): Promise<IUser | false> => {
	// decode jwt
	const decodedToken = await (<{ userId: string }>(
		jwt.verify(token, process.env.JWT_SECRET!)
	));

	if (!decodedToken) return false;

	// check if use exist with id sent in the token
	const user = await findUserById(decodedToken.userId);
	if (!user) return false;

	return user;
};
