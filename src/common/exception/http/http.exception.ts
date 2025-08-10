import { getReasonPhrase, type StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models';

export type { StatusCodes as HttpStatus };

export class HttpException extends Error {
	constructor(
		private readonly statusCode: number,
		message?: string,
	) {
		const defaultMessage = getReasonPhrase(statusCode as StatusCodes) ?? 'Error';
		super(message ?? defaultMessage);

		Error.captureStackTrace?.(this, HttpException);
	}

	getStatus(): number {
		return this.statusCode;
	}

	getResponse(): {
		success: false;
		message: string;
		statusCode: number;
	} {
		return {
			message: this.message,
			statusCode: this.statusCode,
			success: false,
		};
	}

	/** 제거 예정 */
	toServiceResponse(): ServiceResponse {
		return ServiceResponse.failure(this.message, null, this.statusCode);
	}

	/** 런타임 타입 가드 */
	static isHttpException(error: unknown): error is HttpException {
		return error instanceof HttpException;
	}
}
