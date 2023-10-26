import { DataSource, DataSourceOptions } from "typeorm";
import "dotenv/config";

export const dataSourceOptions: DataSourceOptions = {
	applicationName: "lu_folks_dev",
	type: "postgres",
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_DATABASE_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	synchronize: true,
	logging: false,
	database: process.env.POSTGRES_DATABASE_NAME,
	entities: ["dist/**/*.entity.js"],
	migrations: ["dist/database/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
