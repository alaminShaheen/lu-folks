import 'module-alias/register';
import 'dotenv/config';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import UserController from '@/resources/user.controller';
import 'reflect-metadata';

validateEnv();
const app = new App([new UserController('/users')], Number(process.env.PORT));
app.listen();
