import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';

extendZodWithOpenApi(z);

export class SigninInfo {
	constructor(
		readonly userId: string,
		readonly accessToken: string,
	) {}

	static toSchema(): z.ZodTypeAny {
		return z
			.object({
				userId: z.string().describe('유저 ID'),
				accessToken: z.string().describe('액세스 토큰'),
			})
			.strip();
	}
}
