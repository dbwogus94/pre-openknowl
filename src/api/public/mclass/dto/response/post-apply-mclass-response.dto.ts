import { z } from "zod";
import { ResponseDto } from "@/common";

export class PostApplyMClassResponseDto extends ResponseDto<{
  applicationId: string;
}> {
  constructor(applicationId: string) {
    super({ applicationId });
  }

  static of(applicationId: string): PostApplyMClassResponseDto {
    return new PostApplyMClassResponseDto(applicationId);
  }

  static toSchema(): z.ZodTypeAny {
    return ResponseDto.toSchema(z.object({ applicationId: z.string() }));
  }
}
