import { AiCampaignManagerService } from "./ai-campaign-manager.service";
export declare class AiCampaignManagerController {
    private readonly service;
    constructor(service: AiCampaignManagerService);
    generate(vehicleId: string, body: any): Promise<{
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
            selectedChannels: ("instagram" | "tiktok" | "google_search" | "website" | "crm_leads" | "dealer_network" | "matched_buyers" | "gcc_export")[];
            channelPlans: {
                channel: "instagram" | "tiktok" | "google_search" | "website" | "crm_leads" | "dealer_network" | "matched_buyers" | "gcc_export";
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
                channel: "instagram" | "tiktok" | "google_search" | "website" | "crm_leads" | "dealer_network" | "matched_buyers" | "gcc_export";
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
    generateAndSave(vehicleId: string, body: any): Promise<{
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
            selectedChannels: ("instagram" | "tiktok" | "google_search" | "website" | "crm_leads" | "dealer_network" | "matched_buyers" | "gcc_export")[];
            channelPlans: {
                channel: "instagram" | "tiktok" | "google_search" | "website" | "crm_leads" | "dealer_network" | "matched_buyers" | "gcc_export";
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
                channel: "instagram" | "tiktok" | "google_search" | "website" | "crm_leads" | "dealer_network" | "matched_buyers" | "gcc_export";
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
    history(vehicleId: string, limit?: string): Promise<{
        success: boolean;
        vehicleId: string;
        count: any;
        plans: any;
    }>;
    plan(eventId: string): Promise<any>;
    lifecycle(eventId: string): Promise<any>;
    submit(eventId: string, body?: {
        note?: string;
    }): Promise<any>;
    approve(eventId: string, body?: {
        approvedBy?: string;
        note?: string;
    }): Promise<any>;
    reject(eventId: string, body?: {
        rejectedBy?: string;
        reason?: string;
    }): Promise<any>;
    cancel(eventId: string, body?: {
        cancelledBy?: string;
        reason?: string;
    }): Promise<any>;
}
