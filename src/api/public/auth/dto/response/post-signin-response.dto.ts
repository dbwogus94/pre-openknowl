import type z from 'zod';
import { ResponseDto } from '@/common';
import { SigninInfo } from '../info/signin-info.dto';

export class PostSigninResponseDto extends ResponseDto<SigninInfo> {
	constructor(readonly info: SigninInfo) {
		super(info);
	}

	static of(info: SigninInfo): PostSigninResponseDto {
		const dto = new PostSigninResponseDto(info);
		return PostSigninResponseDto.toSchema().parse(dto);
	}

	static toSchema(): z.ZodTypeAny {
		return ResponseDto.toSchema(SigninInfo.toSchema());
	}
}
