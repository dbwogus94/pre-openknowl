import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../http';
import { ApplicationException } from './application.exception';
import { ApplicationExceptionCode, ApplicationExceptionRecord } from './exception-type';

export class ResourceNotFoundException extends ApplicationException {
	constructor(message?: string) {
		super(ApplicationExceptionCode.RESOURCE_NOT_FOUND);
		this.message = message ?? ApplicationExceptionRecord[ApplicationExceptionCode.RESOURCE_NOT_FOUND].message;
	}

	toHttpException(): HttpException {
		return new HttpException(StatusCodes.NOT_FOUND, this.message);
	}
}
