export interface IinvoicesRepository {
    paginate(page: number, limit: number): Promise<any>;
}
