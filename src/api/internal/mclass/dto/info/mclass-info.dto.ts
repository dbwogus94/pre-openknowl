import z from 'zod';
import type { MClassEntity } from '@/orm';

export class MClassInfo
	implements Pick<MClassEntity, 'id' | 'title' | 'maxParticipants' | 'startAt' | 'endAt' | 'createdAt'>
{
	constructor(
		readonly id: string,
		readonly title: string,
		readonly maxParticipants: number,
		readonly startAt: Date | null,
		readonly endAt: Date | null,
		readonly createdAt: Date,
	) {}

	static fromEntity(entity: MClassEntity): MClassInfo {
		return new MClassInfo(
			entity.id,
			entity.title,
			entity.maxParticipants,
			entity.startAt ?? null,
			entity.endAt ?? null,
			entity.createdAt,
		);
	}

	static toSchema(): z.ZodTypeAny {
		return z.object({
			id: z.string(),
			title: z.string(),
			maxParticipants: z.number(),
			startAt: z.date().nullable(),
			endAt: z.date().nullable(),
			createdAt: z.date(),
		});
	}
}
