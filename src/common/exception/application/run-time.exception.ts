import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../http';
import { ApplicationException } from './application.exception';
import { ApplicationExceptionCode } from './exception-type';

export class RunTimeException extends ApplicationException {
	constructor(message?: string) {
		super(ApplicationExceptionCode.RUNTIME_ERROR);
		this.message = message ?? 'Runtime Error';
	}

	toHttpException(): HttpException {
		return new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, this.message);
	}
}
