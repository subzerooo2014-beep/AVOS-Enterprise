import { TrustEngineService } from "./trust-engine.service";
export declare class TrustEngineController {
    private service;
    constructor(service: TrustEngineService);
    buildProfile(body: any): Promise<any>;
    listProfiles(): any;
    explain(entityType: string, entityId: string): Promise<{
        entityType: string;
        entityId: string;
        message: string;
        trustScore?: undefined;
        riskScore?: undefined;
        reputationScore?: undefined;
        dealScore?: undefined;
        summary?: undefined;
        explanation?: undefined;
        factors?: undefined;
    } | {
        entityType: string;
        entityId: string;
        trustScore: any;
        riskScore: any;
        reputationScore: any;
        dealScore: any;
        summary: any;
        explanation: string[];
        factors: any;
        message?: undefined;
    }>;
}
