import type { HttpException } from '../http';
import { type ApplicationExceptionCode, ApplicationExceptionRecord } from './exception-type';

export abstract class ApplicationException extends Error {
	/** 에러 메시지 */
	message: string;

	constructor(readonly code: ApplicationExceptionCode) {
		super();
		Error.captureStackTrace(this);

		const { message } = ApplicationExceptionRecord[this.code];
		this.message = message;
	}

	abstract toHttpException(): HttpException;

	/** 런타임 타입 가드 */
	static isApplicationException(error: unknown): error is ApplicationException {
		return error instanceof ApplicationException;
	}
}
