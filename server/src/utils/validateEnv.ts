import { cleanEnv, port, str } from "envalid";

function validateEnv() {
	cleanEnv(process.env, {
		NODE_ENV: str({ choices: ["development", "production"], default: "development" }),
		PORT: port({ default: 1337 }),
		POSTGRES_HOST: str({ default: "localhost" }),
		POSTGRES_USER: str(),
		POSTGRES_PASSWORD: str(),
		POSTGRES_DATABASE_PORT: port({ default: 5432 }),
		POSTGRES_DATABASE_NAME: str({ default: "lu-folks-db-dev" }),
		ACCESS_TOKEN_SECRET: str(),
		REFRESH_TOKEN_SECRET: str(),
	});
}

export default validateEnv;
