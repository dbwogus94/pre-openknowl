import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse, isAuth } from "@/common";
import { GetMyApplicationsResponseDto } from "./dto";
import { OrmDataSource, UserEntity } from "@/orm";

import { GetUserResponseDto } from "./dto";
import { UserController } from "./user.controller";
import { UserCoreRepository } from "./user.repository";
import { UserService } from "./user.service";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

const userRepository = new UserCoreRepository(
  OrmDataSource.getRepository(UserEntity)
);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// userRegistry.registerPath({
// 	method: 'get',
// 	path: '/users',
// 	tags: ['User'],
// 	responses: createApiResponse(z.array(UserSchema), 'Success'),
// });

// userRouter.get('/', userController.getUsers);

userRegistry.register("GetUserResponse", GetUserResponseDto.toSchema());
userRegistry.registerPath({
  method: "get",
  path: "/users/me",
  tags: ["User"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(GetUserResponseDto.toSchema(), "Success"),
});

// jwt(id)를 문자열로 검증
userRouter.get("/me", isAuth, userController.getUser);

userRegistry.registerPath({
  method: "get",
  path: "/users/me/applications",
  tags: ["User"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(
    GetMyApplicationsResponseDto.toSchema(),
    "Success"
  ),
});
userRouter.get("/me/applications", isAuth, userController.getMyApplications);
