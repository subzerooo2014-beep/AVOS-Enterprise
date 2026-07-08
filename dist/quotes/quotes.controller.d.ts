import { QuotesService } from "./quotes.service";
export declare class QuotesController {
    private service;
    constructor(service: QuotesService);
    findAll(): any;
    create(dto: any): any;
}
