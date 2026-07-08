import { ApikeysService } from "./apikeys.service";
export declare class ApikeysController {
    private service;
    constructor(service: ApikeysService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
