import { PreferencesService } from "./preferences.service";
export declare class PreferencesController {
    private service;
    constructor(service: PreferencesService);
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
