export interface IcontractsRepository {
    paginate(page: number, limit: number): Promise<any>;
}
