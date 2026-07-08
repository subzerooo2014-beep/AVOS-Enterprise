import { SettingsService } from "./settings.service";
export declare class SettingsController {
    private service;
    constructor(service: SettingsService);
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
