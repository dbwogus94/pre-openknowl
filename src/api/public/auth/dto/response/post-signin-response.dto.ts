import { z } from "zod";
import { ResponseDto } from "@/common";
import { SigninInfo } from "../info/signin-info.dto";

export class PostSigninResponseDto extends ResponseDto<SigninInfo> {
  constructor(info: SigninInfo) {
    super(info);
  }

  static of(info: SigninInfo): PostSigninResponseDto {
    return new PostSigninResponseDto(info);
  }

  static toSchema(): z.ZodTypeAny {
    return ResponseDto.toSchema(SigninInfo.toSchema());
  }
}
