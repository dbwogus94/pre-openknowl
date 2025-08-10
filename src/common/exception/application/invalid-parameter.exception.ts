import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../http';
import { ApplicationException } from './application.exception';
import { ApplicationExceptionCode, ApplicationExceptionRecord } from './exception-type';

export class InvalidParameterException extends ApplicationException {
	constructor(message?: string) {
		super(ApplicationExceptionCode.INVALID_PARAMETER);
		this.message = message ?? ApplicationExceptionRecord[ApplicationExceptionCode.INVALID_PARAMETER].message;
	}

	toHttpException(): HttpException {
		return new HttpException(StatusCodes.BAD_REQUEST, this.message);
	}
}
