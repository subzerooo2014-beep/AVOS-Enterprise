import { ListingsService } from "./listings.service";
export declare class ListingsController {
    private service;
    constructor(service: ListingsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
