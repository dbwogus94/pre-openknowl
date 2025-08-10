import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AuthService } from './auth.service';
import {
	type PostSigninRequestDto,
	PostSigninResponseDto,
	type PostSignupRequestDto,
	PostSignupResponseDto,
	SigninCommand,
	SignupCommand,
} from './dto';

export class AuthController {
	constructor(private readonly service: AuthService) {}

	public signup: RequestHandler = async (req: Request, res: Response) => {
		const dto = req.body as PostSignupRequestDto;
		const info = await this.service.signup(SignupCommand.fromRequest(dto));
		return res.status(StatusCodes.CREATED).send(PostSignupResponseDto.of(info));
	};

	public signin: RequestHandler = async (req: Request, res: Response) => {
		const dto = req.body as PostSigninRequestDto;
		const info = await this.service.signin(SigninCommand.fromRequest(dto));
		return res.status(StatusCodes.OK).send(PostSigninResponseDto.of(info));
	};
}
