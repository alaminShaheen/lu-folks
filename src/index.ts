import 'module-alias/register';
import 'dotenv/config';
import validateEnv from '@/utils/ValidateEnv';
import App from './app';
import UserController from '@/resources/User.controller';

validateEnv();
const app = new App(
	[new UserController('/users')],
	Number(process.env.PORT)
);
app.listen();