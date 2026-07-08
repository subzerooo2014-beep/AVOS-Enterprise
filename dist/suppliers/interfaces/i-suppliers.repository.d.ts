export interface IsuppliersRepository {
    paginate(page: number, limit: number): Promise<any>;
}
