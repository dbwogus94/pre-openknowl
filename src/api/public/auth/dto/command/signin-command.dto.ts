import type { PostSigninRequestDto } from '../request/post-signin-request.dto';

export class SigninCommand {
	constructor(
		readonly email: string,
		readonly password: string,
	) {}

	static fromRequest(req: PostSigninRequestDto): SigninCommand {
		return new SigninCommand(req.email, req.password);
	}
}
