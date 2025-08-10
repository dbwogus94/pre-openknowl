import type { z } from 'zod';
import { ResponseDto } from '@/common';
import { GetUserInfo } from '../info/get-user-info.dto';

export class GetUserResponseDto extends ResponseDto<GetUserInfo> {
	constructor(readonly info: GetUserInfo) {
		super(info);
	}

	static of(info: GetUserInfo): GetUserResponseDto;
	static of(info: GetUserInfo[]): GetUserResponseDto[];
	static of(info: GetUserInfo | GetUserInfo[]): GetUserResponseDto | GetUserResponseDto[] {
		if (Array.isArray(info)) {
			return info.map((i) => new GetUserResponseDto(i));
		}
		return new GetUserResponseDto(info);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(GetUserInfo.toSchema());
	}
}
