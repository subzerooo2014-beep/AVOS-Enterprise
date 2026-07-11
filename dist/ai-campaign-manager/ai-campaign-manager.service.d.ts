import { PrismaService } from "../prisma/prisma.service";
type CampaignChannel = "instagram" | "tiktok" | "google_search" | "website" | "crm_leads" | "dealer_network" | "matched_buyers" | "gcc_export";
interface CampaignInput {
    objective?: string;
    country?: string;
    language?: string;
    totalBudget?: number;
    durationDays?: number;
    organicOnly?: boolean;
    preferredChannels?: string[];
}
export declare class AiCampaignManagerService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generatePlan(vehicleId: string, input?: CampaignInput): Promise<{
        success: boolean;
        plan: {
            planId: `${string}-${string}-${string}-${string}-${string}`;
            version: number;
            status: string;
            vehicleId: any;
            objective: string;
            country: string;
            language: string;
            durationDays: number;
            totalBudget: number;
            vehicleSnapshot: {
                id: any;
                vin: any;
                make: any;
                model: any;
                year: any;
                color: any;
                status: any;
                location: any;
                price: number;
                dealerId: any;
                showroomId: any;
            };
            selectedChannels: CampaignChannel[];
            channelPlans: {
                channel: CampaignChannel;
                mode: string;
                budget: number;
                dailyBudget: number;
                priority: string;
                objective: string;
                expectedAction: string;
            }[];
            audience: {
                country: string;
                segments: string[];
                intentSignals: string[];
                priceSegment: string;
                excludedAudiences: string[];
            };
            schedule: {
                channel: CampaignChannel;
                scheduledAt: Date;
                durationDays: number;
                timezone: string;
                strategy: string;
            }[];
            creativeBrief: {
                headline: string;
                keyMessages: (string | null)[];
                callToAction: string;
                language: string;
            };
            intelligence: {
                completenessScore: number;
                confidence: number;
                recommendation: string;
                risks: string[];
            };
            generatedAt: Date;
        };
    }>;
    generateAndSave(vehicleId: string, input?: CampaignInput): Promise<{
        success: boolean;
        eventId: any;
        plan: {
            planId: `${string}-${string}-${string}-${string}-${string}`;
            version: number;
            status: string;
            vehicleId: any;
            objective: string;
            country: string;
            language: string;
            durationDays: number;
            totalBudget: number;
            vehicleSnapshot: {
                id: any;
                vin: any;
                make: any;
                model: any;
                year: any;
                color: any;
                status: any;
                location: any;
                price: number;
                dealerId: any;
                showroomId: any;
            };
            selectedChannels: CampaignChannel[];
            channelPlans: {
                channel: CampaignChannel;
                mode: string;
                budget: number;
                dailyBudget: number;
                priority: string;
                objective: string;
                expectedAction: string;
            }[];
            audience: {
                country: string;
                segments: string[];
                intentSignals: string[];
                priceSegment: string;
                excludedAudiences: string[];
            };
            schedule: {
                channel: CampaignChannel;
                scheduledAt: Date;
                durationDays: number;
                timezone: string;
                strategy: string;
            }[];
            creativeBrief: {
                headline: string;
                keyMessages: (string | null)[];
                callToAction: string;
                language: string;
            };
            intelligence: {
                completenessScore: number;
                confidence: number;
                recommendation: string;
                risks: string[];
            };
            generatedAt: Date;
        };
        savedAt: Date;
    }>;
    history(vehicleId: string, limit?: number): Promise<{
        success: boolean;
        vehicleId: string;
        count: any;
        plans: any;
    }>;
    submitForApproval(eventId: string, note?: string): Promise<any>;
    approve(eventId: string, input?: {
        approvedBy?: string;
        note?: string;
    }): Promise<any>;
    reject(eventId: string, input?: {
        rejectedBy?: string;
        reason?: string;
    }): Promise<any>;
    cancel(eventId: string, input?: {
        cancelledBy?: string;
        reason?: string;
    }): Promise<any>;
    plan(eventId: string): Promise<any>;
    lifecycle(eventId: string): Promise<any>;
    private campaignEvent;
    private changeStatus;
    private objectOf;
    private selectChannels;
    private channelPlans;
    private audience;
    private schedule;
    private completeness;
    private confidence;
    private recommendation;
    private risks;
    private text;
    private integer;
    private money;
}
export {};
