import type { z } from 'zod';
import { ResponseDto } from '@/common';
import { MClassInfo } from '../info/mclass-info.dto';

export class PostCreateMClassResponseDto extends ResponseDto<MClassInfo> {
	constructor(readonly info: MClassInfo) {
		super(info);
	}

	static of(info: MClassInfo): PostCreateMClassResponseDto {
		const dto = new PostCreateMClassResponseDto(info);
		return PostCreateMClassResponseDto.toSchema().parse(dto);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(MClassInfo.toSchema());
	}
}
