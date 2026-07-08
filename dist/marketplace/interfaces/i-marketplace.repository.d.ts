export interface ImarketplaceRepository {
    paginate(page: number, limit: number): Promise<any>;
}
