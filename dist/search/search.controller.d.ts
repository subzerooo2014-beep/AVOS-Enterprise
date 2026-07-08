import { SearchService } from "./search.service";
export declare class SearchController {
    private service;
    constructor(service: SearchService);
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
