import { env } from '@/common';
import { OrmDataSource } from '@/orm';
import { app, logger } from '@/server';

OrmDataSource.initialize().then(() => {
	const server = app.listen(env.PORT, () => {
		const { NODE_ENV, HOST, PORT } = env;
		logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
	});

	const onCloseSignal = async () => {
		logger.info('sigint received, shutting down');

		logger.info('closing database connection pool');
		await OrmDataSource.destroy();

		server.close(() => {
			logger.info('server closed');
			process.exit();
		});

		setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
	};

	process.on('SIGINT', onCloseSignal);
	process.on('SIGTERM', onCloseSignal);
});
