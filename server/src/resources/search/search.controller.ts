import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import errorHandler from "@/middlewares/errorHandler";
import verifyAuthentication from "@/middlewares/verifyAuthentication";
import ISearchService from "@/models/interfaces/ISearchService";

@injectable()
class SearchController extends Controller {
	constructor(@inject("ISearchService") private readonly searchService: ISearchService) {
		super("/search");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = () => {
		this.router.route(`${this.path}`).get(verifyAuthentication, this.getSearchResults);
	};

	private getSearchResults = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const searchTerm = request.query.searchTerm as string;
			const results = await this.searchService.getSearchResults(searchTerm);
			return response.status(httpStatus.OK).send(results);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default SearchController;
