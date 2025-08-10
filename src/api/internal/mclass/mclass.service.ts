import type { CreateMClassCommand } from './dto/command/create-mclass-command.dto';
import { MClassInfo } from './dto/info/mclass-info.dto';
import type { MClassRepository } from './mclass.repository';

export class MClassService {
	constructor(private readonly repository: MClassRepository) {}

	async create(command: CreateMClassCommand, hostId: string): Promise<MClassInfo> {
		command.validateDateRange();

		const entity = await this.repository.create({
			title: command.title,
			description: command.description ?? null,
			maxParticipants: command.maxParticipants,
			startAt: command.startAt ? new Date(command.startAt) : undefined,
			endAt: command.endAt ? new Date(command.endAt) : undefined,
			hostId,
		});

		return MClassInfo.fromEntity(entity);
	}

	async delete(id: string): Promise<void> {
		await this.repository.deleteById(id);
	}
}
