import { PrismaService } from "../prisma/prisma.service";
type TrustFactors = {
    verified?: boolean;
    completedDeals?: number;
    cancelledDeals?: number;
    disputes?: number;
    fastResponse?: boolean;
    documentsReady?: boolean;
    lateDelivery?: number;
    positiveReviews?: number;
    negativeReviews?: number;
    yearsActive?: number;
};
export declare class TrustEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    calculateScore(factors?: TrustFactors): {
        trustScore: number;
        riskScore: number;
        reputationScore: number;
        dealScore: number;
    };
    buildProfile(entityType: string, entityId: string, factors?: TrustFactors): Promise<any>;
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
    listProfiles(): any;
}
export {};
