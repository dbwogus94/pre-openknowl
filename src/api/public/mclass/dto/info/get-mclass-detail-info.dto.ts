import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

import type { MClassEntity } from '@/orm';

export class MClassDetailInfo
	implements Pick<MClassEntity, 'id' | 'title' | 'description' | 'maxParticipants' | 'createdAt' | 'startAt' | 'endAt'>
{
	constructor(
		readonly id: string,
		readonly title: string,
		readonly description: string | null,
		readonly maxParticipants: number,
		readonly createdAt: Date,
		readonly startAt: Date | null,
		readonly endAt: Date | null,
	) {}

	static fromEntity(entity: MClassEntity): MClassDetailInfo;
	static fromEntity(entity: MClassEntity[]): MClassDetailInfo[];
	static fromEntity(entity: MClassEntity | MClassEntity[]): MClassDetailInfo | MClassDetailInfo[] {
		if (Array.isArray(entity)) {
			return entity.map((e) => MClassDetailInfo.fromEntity(e));
		}
		return new MClassDetailInfo(
			entity.id,
			entity.title,
			entity.description ?? null,
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
			description: z.string().nullable().describe('m클래스 설명'),
			maxParticipants: z.number().describe('최대 참가자 수'),
			createdAt: z.date().describe('생성일'),
			startAt: z.date().nullable().describe('시작일'),
			endAt: z.date().nullable().describe('종료일'),
		});
	}
}
