export declare class SchedulerService {
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
