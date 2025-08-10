import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';
import { createApiResponse, isAuth, validateParams, validateQuery } from '@/common';
import { MClassEntity, OrmDataSource } from '@/orm';
import {
	GetMClassDetailResponseDto,
	GetMClassesQuerySchema,
	GetMClassesResponseDto,
	PostApplyMClassResponseDto,
} from './dto';
import { PublicMClassController } from './mclass.controller';
import { MClassCoreRepository } from './mclass.repository';
import { PublicMClassService } from './mclass.service';

export const publicMclassRegistry = new OpenAPIRegistry();
export const publicMclassRouter: Router = express.Router();

const repository = new MClassCoreRepository(OrmDataSource.getRepository(MClassEntity));
const service = new PublicMClassService(repository);
const controller = new PublicMClassController(service);

publicMclassRegistry.registerPath({
	summary: 'm클래스 목록 조회',
	method: 'get',
	path: '/mclasses',
	tags: ['MClass'],
	request: { query: GetMClassesQuerySchema },
	responses: createApiResponse(GetMClassesResponseDto.toSchema(), 'Success', 200),
});
publicMclassRouter.get('/mclasses', validateQuery(GetMClassesQuerySchema), controller.list);

publicMclassRegistry.registerPath({
	summary: 'm클래스 상세 조회',
	method: 'get',
	path: '/mclasses/{id}',
	tags: ['MClass'],
	request: { params: z.object({ id: z.string() }) },
	responses: createApiResponse(GetMClassDetailResponseDto.toSchema(), 'Success', 200),
});
publicMclassRouter.get('/mclasses/:id', controller.detail);

publicMclassRegistry.registerPath({
	summary: 'm클래스 신청',
	method: 'post',
	path: '/mclasses/{id}/apply',
	tags: ['MClass'],
	request: { params: z.object({ id: z.string() }) },
	security: [{ bearerAuth: [] }],
	responses: createApiResponse(PostApplyMClassResponseDto.toSchema(), 'Created', 201),
});
publicMclassRouter.post('/mclasses/:id/apply', isAuth, controller.apply);
