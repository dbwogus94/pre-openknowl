import type { z } from 'zod';
import { ResponseDto } from '@/common';
import { SigninInfo } from '../info/signin-info.dto';

export class SigninResponseDto extends ResponseDto<SigninInfo> {
	constructor(readonly info: SigninInfo) {
		super(info);
	}

	static of(info: SigninInfo): SigninResponseDto {
		const dto = new SigninResponseDto(info);
		return SigninResponseDto.toSchema().parse(dto);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(SigninInfo.toSchema());
	}
}
