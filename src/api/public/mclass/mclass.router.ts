import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';
import { createApiResponse, validateParams, validateQuery } from '@/common';
import { MClassEntity, OrmDataSource } from '@/orm';
import { GetMClassDetailResponseDto, GetMClassesQuerySchema, GetMClassesResponseDto } from './dto';
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
publicMclassRouter.get('/mclasses/:id', validateParams(z.object({ id: z.string() })), controller.detail);
