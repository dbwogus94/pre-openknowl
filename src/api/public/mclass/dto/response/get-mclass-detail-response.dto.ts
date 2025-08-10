import type { z } from 'zod';
import { MClassInfo } from '@/api/internal';
import { ResponseDto } from '@/common';

export class GetMClassDetailResponseDto extends ResponseDto<MClassInfo> {
	constructor(readonly info: MClassInfo) {
		super(info);
	}

	static of(info: MClassInfo): GetMClassDetailResponseDto {
		const dto = new GetMClassDetailResponseDto(info);
		return GetMClassDetailResponseDto.toSchema().parse(dto);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(MClassInfo.toSchema());
	}
}
