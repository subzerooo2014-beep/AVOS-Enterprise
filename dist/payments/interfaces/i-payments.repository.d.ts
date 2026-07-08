export interface IpaymentsRepository {
    paginate(page: number, limit: number): Promise<any>;
}
