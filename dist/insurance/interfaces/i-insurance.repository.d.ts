export interface IinsuranceRepository {
    paginate(page: number, limit: number): Promise<any>;
}
