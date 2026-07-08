import { LocalizationService } from "./localization.service";
export declare class LocalizationController {
    private service;
    constructor(service: LocalizationService);
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
