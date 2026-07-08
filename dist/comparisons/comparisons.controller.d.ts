import { ComparisonsService } from "./comparisons.service";
export declare class ComparisonsController {
    private service;
    constructor(service: ComparisonsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
