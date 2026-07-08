export interface ICrmRepository {
    findAll(query?: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    count(args?: any): Promise<number>;
}
