export interface IquotesRepository {
    paginate(page: number, limit: number): Promise<any>;
}
