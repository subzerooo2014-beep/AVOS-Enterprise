import { MarketingEngineService } from "./marketing-engine.service";
export declare class MarketingEngineController {
    private service;
    constructor(service: MarketingEngineService);
    createCampaign(body: any): Promise<any>;
    listCampaigns(): any;
    findCampaign(id: string): Promise<any>;
    generateAd(id: string, body: any): Promise<any>;
    optimize(id: string, body: any): Promise<any>;
    publishingPlan(id: string, body: any): Promise<any>;
}
