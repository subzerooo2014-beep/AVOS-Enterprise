import { CacheService } from "./cache.service";
export declare class CacheController {
    private service;
    constructor(service: CacheService);
    findAll(): never[];
    findOne(id: string): {
        id: string;
    };
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        deleted: boolean;
        id: string;
    };
}
