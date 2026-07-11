import { AiPublishingPipelineService } from "./ai-publishing-pipeline.service";
export declare class AiPublishingPipelineController {
    private readonly service;
    constructor(service: AiPublishingPipelineService);
    run(id: string): Promise<{
        success: boolean;
        vehicleId: string;
        decision: string;
        selectedChannels: string[];
        jobsCreated: number;
        jobs: any[];
    } | {
        failed: boolean;
        message: any;
        stack: any;
        code: any;
        meta: any;
    }>;
    preview(id: string): Promise<{
        success: boolean;
        vehicleId: string;
        decision: string;
        selectedChannels: string[];
        jobsCreated: number;
        jobs: any[];
    } | {
        failed: boolean;
        message: any;
        stack: any;
        code: any;
        meta: any;
    }>;
}
