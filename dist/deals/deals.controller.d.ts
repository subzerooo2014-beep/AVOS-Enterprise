import { DealsService } from "./deals.service";
export declare class DealsController {
    private service;
    constructor(service: DealsService);
    create(body: any): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    score(id: string): Promise<any>;
    commission(id: string, body: any): Promise<any>;
}
