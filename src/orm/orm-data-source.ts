import { DataSource } from 'typeorm';
import { env } from '@/common';

export const OrmDataSource = new DataSource({
	type: env.DATABASE_TYPE as any,
	host: env.DATABASE_HOST,
	port: +env.DATABASE_PORT,
	database: env.DATABASE_NAME,
	username: env.DATABASE_USER,
	password: env.DATABASE_PASSWORD,
	logging: 'all',
	// logging: ['warn', 'error'],
	entities: ['src/orm/entity/**/*.ts'],
	// dropSchema: false,
	// synchronize: false,
	bigNumberStrings: true,
	connectorPackage: 'mysql2',
	poolSize: env.DATABASE_POOL_SIZE,
	maxQueryExecutionTime: env.DATABASE_MAX_QUERY_EXECUTION_TIME,

	extra: {
		connectionLimit: env.DATABASE_POOL_SIZE,
	},
});
