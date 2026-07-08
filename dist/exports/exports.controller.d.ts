import { ExportsService } from "./exports.service";
export declare class ExportsController {
    private service;
    constructor(service: ExportsService);
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
