import { PublisherDispatcherService } from "../publisher-dispatcher.service";
import { PublisherWatchdogService } from "./publisher-watchdog.service";
import { PublisherSystemService } from "./publisher-system.service";
export declare class PublisherOrchestratorService {
    private readonly dispatcher;
    private readonly watchdog;
    private readonly system;
    constructor(dispatcher: PublisherDispatcherService, watchdog: PublisherWatchdogService, system: PublisherSystemService);
    execute(limit?: number): Promise<{
        success: boolean;
        dispatch: import("../publisher-dispatcher.service").PublisherDispatchBatchResult;
        system: {
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
        };
        finishedAt: Date;
    }>;
}
