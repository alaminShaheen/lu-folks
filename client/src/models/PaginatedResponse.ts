type PaginatedResponse<T> = {
	nextId?: string;
	data: T[];
};

export default PaginatedResponse;
