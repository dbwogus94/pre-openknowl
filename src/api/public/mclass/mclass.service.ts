import { GetMClassesInfo, type GetMClassesQueryDto, MClassDetailInfo } from './dto';
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
}
