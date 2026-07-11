import { ExportTradeService } from "./export-trade.service";
export declare class ExportTradeController {
    private service;
    constructor(service: ExportTradeService);
    create(body: any): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    score(id: string): Promise<any>;
}
