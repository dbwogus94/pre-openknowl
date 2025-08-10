import type { z } from 'zod';
import { ResponseDto } from '@/common';
import { MClassDetailInfo } from '../info/get-mclass-detail-info.dto';

export class GetMClassDetailResponseDto extends ResponseDto<MClassDetailInfo> {
	constructor(readonly info: MClassDetailInfo) {
		super(info);
	}

	static of(info: MClassDetailInfo): GetMClassDetailResponseDto {
		const dto = new GetMClassDetailResponseDto(info);
		return GetMClassDetailResponseDto.toSchema().parse(dto);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(MClassDetailInfo.toSchema());
	}
}
