import { cleanEnv, port, str } from "envalid";

function validateEnv() {
	cleanEnv(process.env, {
		NODE_ENV: str({ choices: ["development", "production"], default: "development" }),
		POSTGRES_USER: str(),
		POSTGRES_PASSWORD: str(),
		POSTGRES_DATABASE_PORT: port({ default: 5432 }),
		PORT: port({ default: 1337 }),
	});
}

export default validateEnv;
