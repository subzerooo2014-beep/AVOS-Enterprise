import { TrafficDecision } from "../enums/traffic-decision.enum";
export interface TrafficState {
    activeRequests: number;
    maximumConcurrentRequests: number;
    recentRequestCount: number;
    requestsPerMinuteLimit: number;
    concurrencyUsagePercent: number;
    loadSheddingActive: boolean;
    lastDecision: TrafficDecision;
    totalAllowed: number;
    totalRejected: number;
    rejectionReasons: Record<string, number>;
}
