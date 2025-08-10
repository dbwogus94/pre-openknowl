import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';

extendZodWithOpenApi(z);

export class PostCreateMClassRequestDto {
	constructor(
		readonly title: string,
		readonly description: string | null,
		readonly maxParticipants: number,
		readonly startAt: string,
		readonly endAt: string,
	) {}

	static toSchema(): z.ZodTypeAny {
		return z.object({
			title: z.string().min(1).max(200),
			description: z.string().nullable().optional().default(null),
			maxParticipants: z.number().int().nonnegative(),
			startAt: z.string().datetime(),
			endAt: z.string().datetime(),
		});
	}
}
