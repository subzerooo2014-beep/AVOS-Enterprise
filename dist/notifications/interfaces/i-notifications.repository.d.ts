export interface InotificationsRepository {
    paginate(page: number, limit: number): Promise<any>;
}
