import express, { type Request, type Response, type Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenAPIDocument } from './open-api-document-generator';

export const openAPIRouter: Router = express.Router();
const openAPIDocument = generateOpenAPIDocument();

// Backward-compatible JSON endpoints
openAPIRouter.get('/swagger.json', (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(openAPIDocument);
});

openAPIRouter.get('/docs.json', (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(openAPIDocument);
});

openAPIRouter.get('/docs-json', (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(openAPIDocument);
});

openAPIRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument));
