import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GetUserResponseDto } from './dto';
import type { UserService } from './user.service';

export class UserController {
	constructor(private readonly userService: UserService) {}

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		// '/users/me' 경로는 JWT에서 주입된 req.id를 사용
		const id = req.id as string;
		const userInfo = await this.userService.getById(id);
		return res.status(StatusCodes.OK).send(GetUserResponseDto.of(userInfo));
	};
}
