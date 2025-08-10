import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GetMClassDetailResponseDto, type GetMClassesQueryDto, GetMClassesResponseDto } from './dto';
import type { PublicMClassService } from './mclass.service';

export class PublicMClassController {
	constructor(private readonly service: PublicMClassService) {}

	public list: RequestHandler = async (req: Request, res: Response) => {
		const query = req.query as unknown as GetMClassesQueryDto;
		const info = await this.service.getList(query);
		return res.status(StatusCodes.OK).send(GetMClassesResponseDto.of(info));
	};

	public detail: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as string;
		const info = await this.service.getDetail(id);
		return res.status(StatusCodes.OK).send(GetMClassDetailResponseDto.of(info));
	};
}
