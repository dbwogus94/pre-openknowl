import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CreateMClassCommand, type PostCreateMClassRequestDto, PostCreateMClassResponseDto } from './dto';
import type { MClassService } from './mclass.service';

export class MClassController {
	constructor(private readonly service: MClassService) {}

	public create: RequestHandler = async (req: Request, res: Response) => {
		const body = req.body as PostCreateMClassRequestDto;
		const hostId = req.user?.id ?? '0';
		const info = await this.service.create(CreateMClassCommand.fromRequest(body), hostId);
		return res.status(StatusCodes.CREATED).send(PostCreateMClassResponseDto.of(info));
	};

	public delete: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		await this.service.delete(id);
		return res.status(StatusCodes.NO_CONTENT).send();
	};
}
