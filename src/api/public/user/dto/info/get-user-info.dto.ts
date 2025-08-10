import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import type { UserEntity } from '@/orm';

extendZodWithOpenApi(z);

export class GetUserInfo implements Pick<UserEntity, 'id' | 'email' | 'createdAt'> {
	constructor(
		readonly id: string,
		readonly email: string,
		readonly createdAt: Date,
	) {}

	static fromEntity(entity: UserEntity): GetUserInfo;
	static fromEntity(entity: UserEntity[]): GetUserInfo[];
	static fromEntity(entity: UserEntity | UserEntity[]): GetUserInfo | GetUserInfo[] {
		if (Array.isArray(entity)) {
			return entity.map((e) => new GetUserInfo(e.id, e.email, e.createdAt));
		}
		return new GetUserInfo(entity.id, entity.email, entity.createdAt);
	}

	static toSchema(): z.ZodTypeAny {
		return z
			.object({
				id: z.string().describe('유저 ID'),
				email: z.string().email().describe('이메일'),
				createdAt: z.date().describe('생성일'),
			})
			.strip();
	}
}
