import { DistributionEngineService } from "./distribution-engine.service";
export declare class DistributionEngineController {
    private service;
    constructor(service: DistributionEngineService);
    createChannel(body: any): any;
    listChannels(): any;
    createJob(body: any): Promise<any>;
    listJobs(): any;
    published(id: string, body: any): Promise<any>;
    republish(id: string, body: any): Promise<any>;
}
