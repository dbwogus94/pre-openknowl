import type { Repository } from 'typeorm';
import { ResourceNotFoundException } from '@/common';
import type { UserEntity } from '@/orm';

export type FindWhereOptions = Partial<Pick<UserEntity, 'email' | 'id'>>;
export type CreateUserParams = Pick<UserEntity, 'email' | 'passwordHash'>;

export type UserRepository = {
	findBy(options: FindWhereOptions): Promise<UserEntity>;
	create(user: UserEntity): Promise<UserEntity>;
};

export class UserCoreRepository implements UserRepository {
	constructor(private readonly ormUserRepo: Repository<UserEntity>) {}

	async findBy(options: FindWhereOptions): Promise<UserEntity> {
		const user = await this.ormUserRepo.findOneBy(options);
		if (!user) throw new ResourceNotFoundException('유저가 존재하지 않습니다.');
		return user;
	}

	async create(params: CreateUserParams): Promise<UserEntity> {
		const user = this.ormUserRepo.create(params);
		return await this.ormUserRepo.save(user);
	}
}
