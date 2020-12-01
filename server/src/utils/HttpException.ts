export default class HttpException extends Error {
	message: string;
	statusCode: number = 500;

	constructor(message: string, statusCode: number) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
	}
}
