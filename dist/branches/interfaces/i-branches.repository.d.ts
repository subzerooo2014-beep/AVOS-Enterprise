export interface IbranchesRepository {
    paginate(page: number, limit: number): Promise<any>;
}
