import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../http';
import { ApplicationException } from './application.exception';
import { ApplicationExceptionCode, ApplicationExceptionRecord } from './exception-type';

export class UnauthorizedException extends ApplicationException {
	constructor(message?: string) {
		super(ApplicationExceptionCode.UNAUTHORIZED);
		this.message = message ?? ApplicationExceptionRecord[ApplicationExceptionCode.UNAUTHORIZED].message;
	}

	toHttpException(): HttpException {
		return new HttpException(StatusCodes.UNAUTHORIZED, this.message);
	}
}
