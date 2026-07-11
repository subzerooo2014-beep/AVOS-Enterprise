import { TrafficDecision } from "../enums/traffic-decision.enum";
import { TrafficPolicy } from "../interfaces/traffic-policy.interface";
import { ResilienceStateService } from "./resilience-state.service";
export declare class TrafficProtectionService {
    private readonly resilience;
    private activeRequests;
    private totalAllowed;
    private totalRejected;
    private lastDecision;
    private readonly requestTimestamps;
    private readonly rejectionReasons;
    private policy;
    constructor(resilience: ResilienceStateService);
    evaluate(path: string): TrafficDecision;
    beginRequest(): void;
    finishRequest(): void;
    getPolicy(): TrafficPolicy;
    updatePolicy(patch: Partial<TrafficPolicy>): TrafficPolicy;
    getState(): {
        activeRequests: number;
        maximumConcurrentRequests: number;
        recentRequestCount: number;
        requestsPerMinuteLimit: number;
        concurrencyUsagePercent: number;
        loadSheddingActive: boolean;
        lastDecision: TrafficDecision;
        totalAllowed: number;
        totalRejected: number;
        rejectionReasons: {
            [k: string]: number;
        };
    };
    private allow;
    private reject;
    private shouldShedPath;
    private getConcurrencyUsagePercent;
    private pruneWindow;
    private matchesPath;
    private readPositiveInteger;
    private readPercentage;
}
