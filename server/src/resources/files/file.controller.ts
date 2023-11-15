import Controller from "@/abstracts/controller";
import { injectable } from "tsyringe";
import {
	createUploadthing,
	createUploadthingExpressHandler,
	type FileRouter,
} from "uploadthing/express";

@injectable()
class FileController extends Controller {
	constructor() {
		super("/uploadthing");
		this.initialiseRoutes();
	}

	protected initialiseRoutes(): void {
		const f = createUploadthing();

		this.router.use(
			this.path,
			createUploadthingExpressHandler({
				router: {
					// Example "profile picture upload" route - these can be named whatever you want!
					"image-upload": f({
						image: {
							maxFileSize: "4MB",
							maxFileCount: 4,
						},
					})
						.middleware(({ req, res }) => {
							return { userId: req.params.userId };
						})
						.onUploadComplete((data) => console.log("file", data)),

					mediaPostImage: f({ image: { maxFileSize: "4MB" } })
						.middleware(({ req, res }) => ({ userId: req.user!.userId }))
						.onUploadComplete((data) => console.log("file", data)),
				} satisfies FileRouter,
			}),
		);
	}
}

export default FileController;
