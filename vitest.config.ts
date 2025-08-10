import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// Node.js 환경에서 테스트 실행 (브라우저 환경이 아닌 서버사이드)
		environment: 'node',
		setupFiles: ['./test/setup.ts'],
		globals: false,
		restoreMocks: true,
		include: ['test/**/*.test.ts'],

		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],

			// 커버리지 측정에서 제외할 파일/폴더 패턴
			exclude: [
				'node_modules/', // 외부 라이브러리
				'dist/', // 빌드 결과물
				'test/', // 테스트 파일 자체
				'**/*.d.ts', // TypeScript 타입 정의 파일
				'**/*.config.*', // 각종 설정 파일
				'**/coverage/**', // 커버리지 리포트 파일
			],
		},

		pool: 'threads',

		poolOptions: {
			threads: {
				// 단일 스레드에서 모든 테스트 실행
				singleThread: true,
			},
		},
	},

	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@test': resolve(__dirname, './test'),
		},
	},
});
