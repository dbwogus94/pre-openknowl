import { InvalidParameterException } from '@/common';
import type { PostCreateMClassRequestDto } from '../post-create-mclass-request.dto';

export class CreateMClassCommand {
	constructor(
		readonly title: string,
		readonly description: string | null,
		readonly maxParticipants: number,
		readonly startAt: string,
		readonly endAt: string,
	) {}

	static fromRequest(req: PostCreateMClassRequestDto): CreateMClassCommand {
		return new CreateMClassCommand(req.title, req.description ?? null, req.maxParticipants, req.startAt, req.endAt);
	}

	validateDateRange(): void {
		if (this.startAt > this.endAt) throw new InvalidParameterException('시작일자가 종료일자보다 이후일 수 없습니다.');
	}
}
