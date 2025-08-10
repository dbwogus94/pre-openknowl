import { z } from "zod";
import { ResponseDto } from "@/common";
import { GetMyApplicationInfo } from "../info/get-my-application-info.dto";

export class GetMyApplicationsResponseDto extends ResponseDto<
  GetMyApplicationInfo[]
> {
  constructor(infos: GetMyApplicationInfo[]) {
    super(infos);
  }

  static of(infos: GetMyApplicationInfo[]): GetMyApplicationsResponseDto {
    return new GetMyApplicationsResponseDto(infos);
  }

  static toSchema(): z.ZodTypeAny {
    return ResponseDto.toSchema(z.array(GetMyApplicationInfo.toSchema()));
  }
}
