import type z from 'zod';
import { ResponseDto } from '@/common';
import { SignupInfo } from '../info/signup-info.dto';

export class PostSignupResponseDto extends ResponseDto<SignupInfo> {
	constructor(info: SignupInfo) {
		super(info);
	}

	static of(info: SignupInfo): PostSignupResponseDto {
		return new PostSignupResponseDto(info);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(SignupInfo.toSchema());
	}
}
