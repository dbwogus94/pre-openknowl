import type { PostSignupRequestDto } from "../request/post-signup-request.dto";

export class SignupCommand {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly isAdmin: boolean = false
  ) {}

  static fromRequest(req: PostSignupRequestDto): SignupCommand {
    return new SignupCommand(req.email, req.password, !!req.isAdmin);
  }
}
