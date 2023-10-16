// custom.d.ts

import TokenPayload from "@/models/types/tokenPayload";

// Extend the Request interface with the custom 'user' property
declare module "express" {
	interface Request {
		user?: TokenPayload;
	}
}
