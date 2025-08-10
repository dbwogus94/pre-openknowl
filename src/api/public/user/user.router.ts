import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { createApiResponse, validateRequest } from '@/common';
import { OrmDataSource, UserEntity } from '@/orm';
import { GetUserResponseDto } from './dto';
import { UserController } from './user.controller';
import { UserCoreRepository } from './user.repository';
import { UserService } from './user.service';
import { GetUserSchema } from './userModel';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

const userRepository = new UserCoreRepository(OrmDataSource.getRepository(UserEntity));
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// userRegistry.registerPath({
// 	method: 'get',
// 	path: '/users',
// 	tags: ['User'],
// 	responses: createApiResponse(z.array(UserSchema), 'Success'),
// });

// userRouter.get('/', userController.getUsers);

userRegistry.register('GetUserResponse', GetUserResponseDto.toSchema());
userRegistry.registerPath({
	method: 'get',
	path: '/users/{id}',
	tags: ['User'],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(GetUserResponseDto.toSchema(), 'Success'),
});

userRouter.get('/:id', validateRequest(GetUserSchema), userController.getUser);
