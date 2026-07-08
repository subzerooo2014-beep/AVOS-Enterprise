import { AuctionsService } from "./auctions.service";
export declare class AuctionsController {
    private service;
    constructor(service: AuctionsService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
