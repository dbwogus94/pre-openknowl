import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const { isAdmin } = req?.user ?? { isAdmin: false };
	if (!isAdmin) {
		return res.status(StatusCodes.FORBIDDEN).json({ message: '관리자 권한이 없습니다.' });
	}
	next();
};
