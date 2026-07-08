export interface ImaintenanceRepository {
    paginate(page: number, limit: number): Promise<any>;
}
