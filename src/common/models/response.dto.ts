import { StatusCodes } from 'http-status-codes';
import z from 'zod';

export class ResponseDto<T> {
	readonly success: boolean;
	readonly message: string;
	readonly body: T;
	readonly statusCode: number;

	constructor(body: T, statusCode: number = StatusCodes.OK, message: string = 'Success') {
		this.success = true;
		this.statusCode = statusCode;
		this.message = message;
		this.body = body;
	}

	static toSchema<T extends z.ZodTypeAny>(schema: T): z.ZodTypeAny {
		return z.object({
			success: z.boolean(),
			message: z.string(),
			body: schema,
		});
	}
}
