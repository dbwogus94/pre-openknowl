import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { ResponseDto } from '@/common';
import { GetMClassesInfo } from '../info/get-mclasses-info.dto';

extendZodWithOpenApi(z);

export class GetMClassesResponseDto extends ResponseDto<GetMClassesInfo> {
	constructor(readonly info: GetMClassesInfo) {
		super(info);
	}

	static of(info: GetMClassesInfo[]): GetMClassesResponseDto[] {
		return info.map((i) => new GetMClassesResponseDto(i));
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(GetMClassesInfo.toSchema());
	}
}
