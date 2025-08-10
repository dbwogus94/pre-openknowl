import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),

  HOST: z.string().min(1).default("localhost"),

  PORT: z.coerce.number().int().positive().default(8080),

  CORS_ORIGIN: z.string().url().default("http://localhost:8080"),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),

  // orm
  DATABASE_TYPE: z.enum(["mysql"]).default("mysql"),
  DATABASE_HOST: z.string().min(1).default("localhost"),
  DATABASE_PORT: z.coerce.number().int().positive().default(13306),
  DATABASE_NAME: z.string().min(1).default("openknowl_dev"),
  DATABASE_USER: z.string().min(1).default("openknowl"),
  DATABASE_PASSWORD: z.string().min(1).default(""),
  DATABASE_LOGGING: z
    .enum(["all", "error", "warn", "info", "log", "query"])
    .default("all"),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(10),

  /** 슬로우 쿼리 타임아웃 */
  DATABASE_MAX_QUERY_EXECUTION_TIME: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  // jwt
  JWT_ISSUER: z.string().min(1).default("MCLASS-API"),
  JWT_SECRET: z.string().min(13).default(""),
  JWT_EXPIRES_IN: z.string().min(1).default("1h"),
  JWT_SUBJECT: z.string().min(1).default("user-info"),

  // bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === "development",
  isProduction: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
};
