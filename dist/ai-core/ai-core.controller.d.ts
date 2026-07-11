import { AiCoreService } from "./ai-core.service";
export declare class AiCoreController {
    private service;
    constructor(service: AiCoreService);
    createAgent(body: any): any;
    listAgents(): any;
    createEvent(body: any): any;
    listEvents(): any;
    explain(body: any): Promise<any>;
}
