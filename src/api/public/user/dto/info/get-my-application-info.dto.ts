import z from "zod";
import type { ApplicationEntity, MClassEntity } from "@/orm";

export class GetMyApplicationInfo {
  constructor(
    readonly applicationId: string,
    readonly mclassId: string,
    readonly title: string,
    readonly appliedAt: Date
  ) {}

  static fromEntities(
    app: ApplicationEntity,
    mclass: MClassEntity
  ): GetMyApplicationInfo {
    return new GetMyApplicationInfo(
      app.id,
      mclass.id,
      mclass.title,
      app.createdAt
    );
  }

  static toSchema(): z.ZodTypeAny {
    return z.object({
      applicationId: z.string(),
      mclassId: z.string(),
      title: z.string(),
      appliedAt: z.date(),
    });
  }
}
