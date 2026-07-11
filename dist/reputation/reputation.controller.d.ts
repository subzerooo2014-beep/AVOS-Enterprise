import { ReputationService } from "./reputation.service";
export declare class ReputationController {
    private service;
    constructor(service: ReputationService);
    snapshot(body: any): Promise<any>;
    list(): any;
    timeline(entityType: string, entityId: string): any;
}
