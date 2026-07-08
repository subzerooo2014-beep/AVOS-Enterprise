export interface IdocumentsRepository {
    paginate(page: number, limit: number): Promise<any>;
}
