import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GetMClassDetailResponseDto, type GetMClassesQueryDto, GetMClassesResponseDto } from './dto';
import { ApplyMClassCommand } from './dto/command/apply-mclass-command.dto';
import { PostApplyMClassResponseDto } from './dto/response/post-apply-mclass-response.dto';
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

	public apply: RequestHandler = async (req: Request, res: Response) => {
		const userId = req.user?.id as string;
		const mclassId = req.params.id as string;
		const applicationId = await this.service.apply(new ApplyMClassCommand(mclassId, userId));
		return res.status(StatusCodes.CREATED).send(PostApplyMClassResponseDto.of(applicationId));
	};
}
