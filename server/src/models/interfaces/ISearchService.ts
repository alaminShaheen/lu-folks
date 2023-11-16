import SearchResult from "@/models/types/SearchResult";

interface ISearchService {
	getSearchResults: (searchTerm: string) => Promise<SearchResult>;
}

export default ISearchService;
