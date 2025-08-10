import z from 'zod';

export class SigninInfo {
	constructor(
		readonly userId: string,
		readonly accessToken: string,
	) {}

	static toSchema(): z.ZodTypeAny {
		return z.object({ userId: z.string(), accessToken: z.string() });
	}
}
