export interface IorganizationsRepository {
    paginate(page: number, limit: number): Promise<any>;
}
