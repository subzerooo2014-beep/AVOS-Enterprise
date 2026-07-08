import { UploadsService } from "./uploads.service";
export declare class UploadsController {
    private service;
    constructor(service: UploadsService);
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
