import { JwtService } from '@nestjs/jwt';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { JwtPayload } from '../../api';
import { HttpException } from '../exception';
import { env } from '../utils';

const jwtService = new JwtService({
	secret: env.JWT_SECRET,
	signOptions: {
		expiresIn: env.JWT_EXPIRES_IN,
		issuer: env.JWT_ISSUER,
		subject: env.JWT_SUBJECT,
	},
});

/**
 * ### Authentication(인증)
 * 요청 헤더에 jwt 토큰이 유효한지 검사하는 미들웨어
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 * 401 {message}
 * - Authorization 헤더와 Bearer type가 들어있지 않을 때 401 응답
 * - jwt 디코딩이 불가능할 때 401 응답
 */
export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	const exception = new HttpException(StatusCodes.UNAUTHORIZED);

	// 1. 요청에 토큰이 포함된 인증헤더가 있는지 확인
	const authHeader = req.get('Authorization');
	if (!authHeader?.startsWith('Bearer')) {
		return res.status(exception.getStatus()).json(exception.getResponse());
	}
	// 2. jwt가 있다면 유효한지 확인
	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwtService.verify(token) as { id: string; email: string; isAdmin: boolean };
		if (!decoded?.id) {
			return res.status(exception.getStatus()).json(exception.getResponse());
		}
		req.user = decoded;
		// req.token = token; TODO: 필요하면 Response 타입을 확장한다.
		next();
	} catch {
		return res.status(exception.getStatus()).json(exception.getResponse());
	}
};
