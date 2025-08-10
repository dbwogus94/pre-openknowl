import { type JwtService, TokenExpiredError } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { ConflictStatusException, RunTimeException, UnauthorizedException } from '@/common';
import type { UserEntity } from '@/orm';
import type { UserRepository } from '../user/user.repository';
import { type SigninCommand, SigninInfo, type SignupCommand, SignupInfo } from './dto';

type JwtPayload = Pick<UserEntity, 'id'> & { email: string; isAdmin: boolean };
type JwtConfig = {
	secret: string;
	expiresIn: string;
	issuer: string;
	subject: string;
};

export type DecodeTokenResult = {
	payload: JwtPayload | null;
	status: 'fail' | 'expired' | 'success';
};

export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly jwtConfig: JwtConfig,
		private readonly repository: UserRepository,
	) {}

	/**
	 * 유저 회원가입
	 * @param dto
	 */
	async signup(command: SignupCommand): Promise<SignupInfo> {
		const existed = await this.repository.exists({ email: command.email });
		if (existed) throw new ConflictStatusException('이미 사용중인 이메일입니다.');

		const passwordHash = await this.hashPassword(command.password);
		const user = await this.repository.create({
			email: command.email,
			passwordHash,
		});
		return new SignupInfo(user.id);
	}

	/**
	 * 유저 로그인
	 * - 엑세스 토큰, 리프레쉬 토큰 발급
	 * @param dto
	 * @returns
	 */
	async signin(command: SigninCommand): Promise<SigninInfo> {
		const user = await this.repository.findBy({ email: command.email });
		await this.comparePassword(command.password, user.passwordHash);

		const token = this.issueToken({
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		});
		return new SigninInfo(user.id, token);
	}

	async hashPassword(password: string, saltRounds: number = 10): Promise<string> {
		return await bcrypt.hash(password, saltRounds);
	}

	async comparePassword(password: string, passwordHash: string): Promise<void> {
		const isMatch = await bcrypt.compare(password, passwordHash);
		if (!isMatch) throw new UnauthorizedException();
	}

	issueToken(payload: JwtPayload, expiresIn?: string): string {
		expiresIn = expiresIn ?? this.jwtConfig.expiresIn;

		const { issuer, subject, secret } = this.jwtConfig;
		return this.jwtService.sign(payload, {
			secret,
			issuer,
			expiresIn,
			subject,
		});
	}

	decodeToken(token: string): DecodeTokenResult {
		try {
			const { issuer, subject, secret } = this.jwtConfig;
			const payload = this.jwtService.verify(token, {
				secret,
				issuer, // Note: 발행자까지 일치하는지 확인한다.
				subject,
			});

			return { payload, status: 'success' };
		} catch (error) {
			const isExpired = error instanceof TokenExpiredError;
			if (isExpired) {
				return { payload: null, status: 'expired' };
			} else {
				// 만료 이외의 오류
				return { payload: null, status: 'fail' };
			}
		}
	}
}
