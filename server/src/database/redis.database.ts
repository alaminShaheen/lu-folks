import process from "process";
import { Redis } from "@upstash/redis";
import { Lifecycle, scoped } from "tsyringe";

@scoped(Lifecycle.ContainerScoped)
class RedisDatabase {
	constructor() {
		this._redisInstance = new Redis({
			url: process.env.REDIS_URL!,
			token: process.env.REDIS_TOKEN!,
		});
	}

	private _redisInstance: Redis;

	public get redisInstance(): Redis {
		return this._redisInstance;
	}
}

export default RedisDatabase;
