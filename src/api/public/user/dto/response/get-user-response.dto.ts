import type z from 'zod';
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
			return info.map((i) => GetUserResponseDto.of(i));
		}
		const dto = new GetUserResponseDto(info);
		// 스키마로 정제하여 정의되지 않은/불필요한 필드 제거
		return GetUserResponseDto.toSchema().parse(dto);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(GetUserInfo.toSchema());
	}
}
