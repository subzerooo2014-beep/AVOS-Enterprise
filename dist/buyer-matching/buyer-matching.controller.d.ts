import { BuyerMatchingService } from "./buyer-matching.service";
export declare class BuyerMatchingController {
    private service;
    constructor(service: BuyerMatchingService);
    createLead(body: any): Promise<any>;
    listLeads(): any;
    match(id: string, body: any): Promise<any>;
    listMatches(): any;
}
