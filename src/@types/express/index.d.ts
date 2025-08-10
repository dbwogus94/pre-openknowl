export {};

declare global {
	namespace Express {
		interface Request {
			user?: { id: string; email: string; isAdmin: boolean };
		}
	}
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: { id: string; email: string; isAdmin: boolean };
	}
}

declare module 'express' {
	interface Request {
		user?: { id: string; email: string; isAdmin: boolean };
	}
}
