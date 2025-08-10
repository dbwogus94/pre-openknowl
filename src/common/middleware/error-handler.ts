import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApplicationException, HttpException } from '../exception';

const unexpectedRequest: RequestHandler = (_req, res) => {
	const httpException = new HttpException(StatusCodes.NOT_FOUND, 'Not Found');
	return res.status(httpException.getStatus()).send(httpException.getResponse());
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
	res.locals.err = err;

	// app 에러
	if (ApplicationException.isApplicationException(err)) {
		return res.status(err.toHttpException().getStatus()).send(err.toHttpException().getResponse());
	}

	// http 에러
	if (HttpException.isHttpException(err)) {
		return res.status(err.getStatus()).send(err.getResponse());
	}

	// 예상치 못 한 예외
	if (err instanceof Error) {
		const httpException = new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
		return res.status(httpException.getStatus()).send(httpException.getResponse());
	}

	next(err);
};

export const errorHandler = (): [RequestHandler, ErrorRequestHandler] => [unexpectedRequest, addErrorToRequestLog];
