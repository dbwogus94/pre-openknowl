import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';

extendZodWithOpenApi(z);

export class GetMClassesQueryDto {
	constructor(
		readonly page: number = 1,
		readonly pageSize: number = 20,
	) {}

	static toSchema(): typeof GetMClassesQuerySchema {
		return GetMClassesQuerySchema;
	}
}

export const GetMClassesQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(20),
});
