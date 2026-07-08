import { FilesService } from "./files.service";
export declare class FilesController {
    private service;
    constructor(service: FilesService);
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
