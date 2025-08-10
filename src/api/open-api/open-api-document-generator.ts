import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { healthCheckRegistry } from '../health-check';
import { authRegistry, userRegistry } from '../public';

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3['generateDocument']>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, authRegistry]);
	// 보안 스키마는 레지스트리에 컴포넌트로 등록
	registry.registerComponent('securitySchemes', 'bearerAuth', {
		type: 'http',
		scheme: 'bearer',
		bearerFormat: 'JWT',
		description: 'Input your JWT token in the format: Bearer <token>',
	});

	const generator = new OpenApiGeneratorV3(registry.definitions);
	const doc = generator.generateDocument({
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'Swagger API',
		},
		externalDocs: {
			description: 'View the raw OpenAPI Specification in JSON format',
			url: '/docs.json',
		},
	});

	// 전역 보안 적용 (타입 제한 회피를 위해 생성 후 주입)
	// (doc as any).security = [{ bearerAuth: [] }];
	return doc;
}
