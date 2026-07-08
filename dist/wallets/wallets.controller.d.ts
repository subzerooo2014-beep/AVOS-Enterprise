import { WalletsService } from "./wallets.service";
export declare class WalletsController {
    private service;
    constructor(service: WalletsService);
    findAll(): any;
    create(dto: any): any;
}
