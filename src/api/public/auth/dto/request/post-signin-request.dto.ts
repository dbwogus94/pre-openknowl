import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';

extendZodWithOpenApi(z);

export class PostSigninRequestDto {
	constructor(
		readonly email: string,
		readonly password: string,
	) {}

	static toSchema(): z.ZodTypeAny {
		return z.object({
			email: z.string().email().openapi({ example: 'user@example.com' }),
			password: z.string().min(8).max(64).openapi({ example: 'P@ssw0rd!123' }),
		});
	}
}
