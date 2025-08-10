import type { Repository } from 'typeorm';
import { ResourceNotFoundException } from '@/common';
import type { UserEntity } from '@/orm';

export type FindWhereOptions = Partial<Pick<UserEntity, 'email' | 'id'>>;
export type CreateUserParams = Pick<UserEntity, 'email' | 'passwordHash'>;

export type UserRepository = {
	exists(options: FindWhereOptions): Promise<boolean>;
	findBy(options: FindWhereOptions): Promise<UserEntity>;
	create(params: CreateUserParams): Promise<UserEntity>;
};

export class UserCoreRepository implements UserRepository {
	constructor(private readonly ormUserRepo: Repository<UserEntity>) {}

	async exists(options: FindWhereOptions): Promise<boolean> {
		const user = await this.ormUserRepo.findOneBy(options);
		return user !== null;
	}

	async findBy(options: FindWhereOptions): Promise<UserEntity> {
		const user = await this.ormUserRepo.findOneBy(options);
		if (!user) throw new ResourceNotFoundException();
		return user;
	}

	async create(params: CreateUserParams): Promise<UserEntity> {
		const user = this.ormUserRepo.create(params);
		return await this.ormUserRepo.save(user);
	}
}
