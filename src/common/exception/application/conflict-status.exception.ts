import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../http';
import { ApplicationException } from './application.exception';
import { ApplicationExceptionCode, ApplicationExceptionRecord } from './exception-type';

export class ConflictStatusException extends ApplicationException {
	constructor(message?: string) {
		super(ApplicationExceptionCode.CONFLICT_STATUS);
		this.message = message ?? ApplicationExceptionRecord[ApplicationExceptionCode.CONFLICT_STATUS].message;
	}

	toHttpException(): HttpException {
		return new HttpException(StatusCodes.CONFLICT, this.message);
	}
}
