import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import type { MClassEntity } from '@/orm';

extendZodWithOpenApi(z);

export class GetMClassesInfo
	implements Pick<MClassEntity, 'id' | 'title' | 'maxParticipants' | 'createdAt' | 'startAt' | 'endAt'>
{
	constructor(
		readonly id: string,
		readonly title: string,
		readonly maxParticipants: number,
		readonly createdAt: Date,
		readonly startAt: Date | null,
		readonly endAt: Date | null,
	) {}

	static fromEntity(entity: MClassEntity): GetMClassesInfo;
	static fromEntity(entity: MClassEntity[]): GetMClassesInfo[];
	static fromEntity(entity: MClassEntity | MClassEntity[]): GetMClassesInfo | GetMClassesInfo[] {
		if (Array.isArray(entity)) {
			return entity.map((e) => GetMClassesInfo.fromEntity(e));
		}
		return new GetMClassesInfo(
			entity.id,
			entity.title,
			entity.maxParticipants,
			entity.createdAt,
			entity.startAt ?? null,
			entity.endAt ?? null,
		);
	}

	static toSchema(): z.ZodTypeAny {
		return z.object({
			id: z.string().describe('m클래스 ID'),
			title: z.string().describe('m클래스 제목'),
			maxParticipants: z.number().describe('최대 참가자 수'),
			createdAt: z.date().describe('생성일'),
			startAt: z.date().nullable().describe('시작일'),
			endAt: z.date().nullable().describe('종료일'),
		});
	}
}
