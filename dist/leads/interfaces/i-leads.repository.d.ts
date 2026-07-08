export interface IleadsRepository {
    paginate(page: number, limit: number): Promise<any>;
}
