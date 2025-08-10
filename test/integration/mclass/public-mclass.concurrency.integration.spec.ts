import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ApplyMClassCommand } from '../../../src/api/public/mclass/dto/command/apply-mclass-command.dto';
import { MClassCoreRepository } from '../../../src/api/public/mclass/mclass.repository';
import { PublicMClassService } from '../../../src/api/public/mclass/mclass.service';
import { ApplicationEntity, MClassEntity, OrmDataSource, UserEntity } from '../../../src/orm/index';

describe('PublicMClassService concurrency', () => {
	let service: PublicMClassService;

	beforeAll(async () => {
		if (!OrmDataSource.isInitialized) {
			await OrmDataSource.initialize();
		}
		await OrmDataSource.synchronize(true);
		service = new PublicMClassService(new MClassCoreRepository(OrmDataSource.getRepository(MClassEntity)));
	});

	afterAll(async () => {
		if (OrmDataSource.isInitialized) await OrmDataSource.destroy();
	});

	beforeEach(async () => {
		await OrmDataSource.manager.clear(ApplicationEntity);
		await OrmDataSource.manager.clear(MClassEntity);
		await OrmDataSource.manager.clear(UserEntity);
	});

	it('동시에 여러 명이 신청하면 첫 번째만 성공한다', async () => {
		// Given
		const host = await OrmDataSource.manager.save(
			OrmDataSource.manager.create(UserEntity, {
				email: 'host@example.com',
				passwordHash: 'x',
			}),
		);
		const mclass = await OrmDataSource.manager.save(
			OrmDataSource.manager.create(MClassEntity, {
				title: 'Concurrency Class',
				description: null,
				maxParticipants: 1,
				hostId: host.id,
			}),
		);

		const userIds = Array.from({ length: 50 }, (_, i) => i + 1);
		await Promise.all(
			userIds.map((i) =>
				OrmDataSource.manager.save(
					OrmDataSource.manager.create(UserEntity, {
						email: `u${i}@ex.com`,
						passwordHash: 'x',
					}),
				),
			),
		);

		const results = await Promise.allSettled(
			userIds.map((_, idx) => service.apply(new ApplyMClassCommand(mclass.id, String(idx + 1)))),
		);

		const success = results.filter((r) => r.status === 'fulfilled');
		const failed = results.filter((r) => r.status === 'rejected');
		expect(success.length).toBe(1);
		expect(failed.length).toBe(userIds.length - 1);
	});
});
