import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { JwtService } from '@nestjs/jwt';
import express, { type Router } from 'express';
import { createApiResponse, env, validateBody } from '@/common';
import { OrmDataSource, UserEntity } from '@/orm';

import { UserCoreRepository } from '../user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PostSigninRequestDto, PostSigninResponseDto, PostSignupRequestDto, PostSignupResponseDto } from './dto';

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

const repository = new UserCoreRepository(OrmDataSource.getRepository(UserEntity));
const service = new AuthService(
	new JwtService(),
	{
		secret: env.JWT_SECRET,
		expiresIn: env.JWT_EXPIRES_IN,
		issuer: env.JWT_ISSUER,
		subject: env.JWT_SUBJECT,
	},
	repository,
);
const controller = new AuthController(service);

authRegistry.registerPath({
	summary: '유저 회원가입',
	method: 'post',
	path: '/auth/signup',
	tags: ['Auth'],
	request: {
		body: {
			content: {
				'application/json': { schema: PostSignupRequestDto.toSchema() },
			},
		},
	},
	responses: createApiResponse(PostSignupResponseDto.toSchema(), 'Created', 201),
});
authRouter.post('/signup', validateBody(PostSignupRequestDto.toSchema()), controller.signup);

authRegistry.registerPath({
	summary: '유저 로그인',
	method: 'post',
	path: '/auth/signin',
	tags: ['Auth'],
	request: {
		body: {
			content: {
				'application/json': { schema: PostSigninRequestDto.toSchema() },
			},
		},
	},
	responses: createApiResponse(PostSigninResponseDto.toSchema(), 'Success', 200),
});
authRouter.post('/signin', validateBody(PostSigninRequestDto.toSchema()), controller.signin);
