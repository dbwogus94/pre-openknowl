import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GetUserResponseDto } from './dto';
import type { UserService } from './user.service';

export class UserController {
	constructor(private readonly userService: UserService) {}
	// public getUsers: RequestHandler = async (_req: Request, res: Response) => {
	// 	const serviceResponse = await userService.findAll();
	// 	res.status(serviceResponse.statusCode).send(serviceResponse);
	// };

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		const userInfo = await this.userService.getById(id);
		return res.status(StatusCodes.OK).send(GetUserResponseDto.of(userInfo));
	};
}
