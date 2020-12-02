declare namespace Express {
	interface Request {
		user?: import('../../src/users/users.schema').I;
	}
}
