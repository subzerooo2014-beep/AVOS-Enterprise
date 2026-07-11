import { PublisherDashboardV2Service } from "./publisher-dashboard-v2.service";
import { PublisherHealthMonitorService } from "./publisher-health-monitor.service";
export declare class PublisherSystemService {
    private readonly dashboard;
    private readonly health;
    constructor(dashboard: PublisherDashboardV2Service, health: PublisherHealthMonitorService);
    status(): Promise<{
        success: boolean;
        engine: string;
        version: string;
        health: {
            success: boolean;
            engine: string;
            channels: {
                channel: string;
                status: import("..").PublisherStatus;
            }[];
            checkedAt: Date;
        };
        dashboard: {
            success: boolean;
            statistics: {
                success: boolean;
                statistics: any;
                generatedAt: Date;
            };
            performance: {
                success: boolean;
                totalJobs: any;
                measuredJobs: number;
                averageExecutionMs: number;
                generatedAt: Date;
            };
            channels: {
                success: boolean;
                channels: Record<string, any>;
                generatedAt: Date;
            };
            workers: {
                success: boolean;
                workers: Record<string, any>;
                generatedAt: Date;
            };
            generatedAt: Date;
        };
        generatedAt: Date;
    }>;
}
