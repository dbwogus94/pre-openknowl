import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import z from 'zod';
import { commonValidations, createApiResponse, isAdmin, isAuth, validateBody } from '@/common';
import { MClassEntity, OrmDataSource } from '@/orm';
import { PostCreateMClassRequestDto } from './dto/post-create-mclass-request.dto';
import { PostCreateMClassResponseDto } from './dto/response/post-create-mclass-response.dto';
import { MClassController } from './mclass.controller';
import { MClassCoreRepository } from './mclass.repository';
import { MClassService } from './mclass.service';

export const mclassRegistry = new OpenAPIRegistry();
export const mclassRouter: Router = express.Router();

const repository = new MClassCoreRepository(OrmDataSource.getRepository(MClassEntity));
const service = new MClassService(repository);
const controller = new MClassController(service);

mclassRegistry.registerPath({
	summary: 'Internal m클래스 생성',
	method: 'post',
	path: '/internal/mclasses',
	tags: ['Internal-MClass'],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				'application/json': { schema: PostCreateMClassRequestDto.toSchema() },
			},
		},
	},
	responses: createApiResponse(PostCreateMClassResponseDto.toSchema(), 'Created', 201),
});
mclassRouter.post('/', isAuth, isAdmin, validateBody(PostCreateMClassRequestDto.toSchema()), controller.create);

mclassRegistry.registerPath({
	summary: 'Internal m클래스 삭제',
	method: 'delete',
	path: '/internal/mclasses/{id}',
	tags: ['Internal-MClass'],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ id: commonValidations.id }),
	},
	responses: createApiResponse(PostCreateMClassResponseDto.toSchema(), 'No Content', 204),
});
mclassRouter.delete('/:id', isAuth, isAdmin, controller.delete);
