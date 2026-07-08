import { MarketplaceService } from "./marketplace.service";
export declare class MarketplaceController {
    private service;
    constructor(service: MarketplaceService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
