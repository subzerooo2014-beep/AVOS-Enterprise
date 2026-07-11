import { AiCampaignEngineService } from "./ai-campaign-engine.service";
export declare class AiCampaignEngineController {
    private readonly service;
    constructor(service: AiCampaignEngineService);
    launch(id: string): Promise<{
        success: boolean;
        vehicleId: string;
        campaign: any;
        creativesCreated: number;
        jobsCreated: number;
        creatives: any[];
        jobs: any[];
    }>;
    preview(id: string): Promise<{
        success: boolean;
        vehicleId: string;
        campaign: any;
        creativesCreated: number;
        jobsCreated: number;
        creatives: any[];
        jobs: any[];
    }>;
}
