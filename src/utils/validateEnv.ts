import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
	cleanEnv(process.env, {
		NODE_ENV: str({ choices: ['development', 'production'] }),
		MONGO_URL: str(),
		PORT: port({ default: 1337 })
	});
}

export default validateEnv;