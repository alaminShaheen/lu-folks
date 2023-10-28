import PostgresDatabase from "@/database/postgres.database";
import { injectable } from "tsyringe";
import IPostService from "@/models/interfaces/IPostService";
import { Post } from "@prisma/client";
import HttpException from "@/exceptions/httpException";
import httpStatus from "http-status";
import axios from "axios";
import UnfurledData from "@/models/types/UnfurledData";

@injectable()
class PostService implements IPostService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

	createPost(): Promise<void> {
		return Promise.resolve(undefined);
	}

	public unfurlLink = async (url: string): Promise<UnfurledData> => {
		try {
			const properUrl = new URL(url);
			const href = properUrl.searchParams.get("url");

			if (!href) {
				console.log("Invalid href provided");
				throw new HttpException(httpStatus.BAD_REQUEST, "Invalid href provided");
			}

			const { data } = await axios.get(href);

			const titleMatch = (data as string).match(/<title>(.*?)<\/title>/);
			const title = titleMatch?.[1] || "";

			const descriptionMatch = (data as string).match(
				/<meta name="description" content="(.*?)"/,
			);
			const description = descriptionMatch?.[1] || "";

			const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/);
			const imageUrl = imageMatch?.[1] || "";

			return {
				unfurledData: JSON.stringify({
					success: 1,
					meta: {
						title,
						description,
						image: {
							url: imageUrl,
						},
					},
				}),
			};
		} catch (error) {
			throw error;
		}
	};

	deletePost(postId: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	getUserPosts(userId: string): Promise<Post[]> {
		return Promise.resolve([]);
	}

	updatePost(postInfo: Partial<Post>): Promise<void> {
		return Promise.resolve(undefined);
	}
}

export default PostService;
