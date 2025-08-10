import z from "zod";

export class SignupInfo {
  constructor(readonly userId: string) {}

  static toSchema(): z.ZodTypeAny {
    return z.object({ userId: z.string() });
  }
}
