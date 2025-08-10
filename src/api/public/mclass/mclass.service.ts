import { ConflictStatusException, ResourceNotFoundException } from '@/common';
import { ApplicationEntity, MClassEntity, OrmDataSource } from '@/orm';
import { GetMClassesInfo, type GetMClassesQueryDto, MClassDetailInfo } from './dto';
import type { ApplyMClassCommand } from './dto/command/apply-mclass-command.dto';
import type { MClassRepository } from './mclass.repository';

export class PublicMClassService {
	constructor(private readonly repository: MClassRepository) {}

	async getList(query: GetMClassesQueryDto): Promise<GetMClassesInfo[]> {
		const { page, pageSize } = query;
		const [rows] = await this.repository.findPage({ page, pageSize });
		return GetMClassesInfo.fromEntity(rows);
	}

	async getDetail(id: string): Promise<MClassDetailInfo> {
		const entity = await this.repository.findById(id);
		return MClassDetailInfo.fromEntity(entity);
	}

	/**
	 * 신청(응모) - 동시성 고려
	 * - UNIQUE(userId, mclassId)로 중복 방지
	 * - 단일 트랜잭션에서 mclass 정원 확인 후 INSERT + appliedCount 증가
	 */
	async apply(command: ApplyMClassCommand): Promise<string> {
		return await OrmDataSource.transaction(async (manager) => {
			const txMClassRepo = manager.getRepository(MClassEntity);
			const txAppRepo = manager.getRepository(ApplicationEntity);

			// 1) 대상 클래스 잠금(비관적 락)
			const mclass = await txMClassRepo.findOne({
				where: { id: command.mclassId },
				lock: { mode: 'pessimistic_write' },
			});
			if (!mclass) throw new ResourceNotFoundException('클래스가 존재하지 않습니다.');
			if (!mclass.isActive()) throw new ConflictStatusException('신청 가능 상태가 아닙니다.');
			if (mclass.isFull()) throw new ConflictStatusException('정원이 초과되었습니다.');
			if (mclass.isEnded()) throw new ConflictStatusException('이미 종료된 클래스입니다.');

			// 3) 신청 INSERT (UNIQUE 충돌 시 에러)
			try {
				const application = txAppRepo.create({
					userId: command.userId,
					mclassId: command.mclassId,
				});
				const saved = await txAppRepo.save(application);
				// 4) appliedCount 증가
				await txMClassRepo.increment({ id: command.mclassId }, 'appliedCount', 1);
				return saved.id;
			} catch (e: any) {
				// MySQL duplicate key
				if (e?.code === 'ER_DUP_ENTRY' || e?.errno === 1062) {
					throw new ConflictStatusException('이미 신청된 클래스입니다.');
				}
				throw e;
			}
		});
	}
}
