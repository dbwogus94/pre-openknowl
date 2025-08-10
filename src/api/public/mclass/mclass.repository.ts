import type { Repository } from 'typeorm';
import { ResourceNotFoundException } from '@/common';
import type { MClassEntity } from '@/orm';

export type CreateMClassParams = Pick<
	MClassEntity,
	'title' | 'description' | 'maxParticipants' | 'startAt' | 'endAt' | 'hostId'
>;

export type FindMClassesOptions = { page: number; pageSize: number };

export type MClassRepository = {
	create(params: CreateMClassParams): Promise<MClassEntity>;
	findById(id: string): Promise<MClassEntity>;
	deleteById(id: string): Promise<void>;
	findPage(options: FindMClassesOptions): Promise<[MClassEntity[], number]>;
};

export class MClassCoreRepository implements MClassRepository {
	constructor(private readonly repo: Repository<MClassEntity>) {}

	async create(params: CreateMClassParams): Promise<MClassEntity> {
		const entity = this.repo.create(params);
		return await this.repo.save(entity);
	}

	async findById(id: string): Promise<MClassEntity> {
		const found = await this.repo.findOne({ where: { id } });
		if (!found) throw new ResourceNotFoundException('MClass가 존재하지 않습니다.');
		return found;
	}

	async deleteById(id: string): Promise<void> {
		const result = await this.repo.delete({ id });
		if (!result.affected) throw new ResourceNotFoundException('MClass가 존재하지 않습니다.');
	}

	async findPage({ page, pageSize }: FindMClassesOptions): Promise<[MClassEntity[], number]> {
		return await this.repo.findAndCount({
			order: { createdAt: 'DESC' },
			skip: (page - 1) * pageSize,
			take: pageSize,
		});
	}
}
