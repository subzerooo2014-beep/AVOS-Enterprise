import { ResilienceMode } from "../enums/resilience-mode.enum";
export interface ResilienceEvent {
    id: string;
    type: string;
    message: string;
    previousMode?: ResilienceMode;
    currentMode: ResilienceMode;
    metadata?: Record<string, unknown>;
    createdAt: string;
}
