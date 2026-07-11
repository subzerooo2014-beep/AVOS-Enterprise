import { ResilienceMode } from "../enums/resilience-mode.enum";
import { ResilienceEvent } from "../interfaces/resilience-event.interface";
export declare class ResilienceStateService {
    private mode;
    private maintenanceReason;
    private readonly events;
    getMode(): ResilienceMode;
    isMaintenance(): boolean;
    isBrownout(): boolean;
    isEmergency(): boolean;
    getMaintenanceReason(): string | null;
    setMode(mode: ResilienceMode, reason?: string): {
        mode: ResilienceMode;
        maintenanceReason: string | null;
        brownoutActive: boolean;
        maintenanceActive: boolean;
        emergencyActive: boolean;
        updatedAt: string;
    };
    getSnapshot(): {
        mode: ResilienceMode;
        maintenanceReason: string | null;
        brownoutActive: boolean;
        maintenanceActive: boolean;
        emergencyActive: boolean;
        updatedAt: string;
    };
    getRecentEvents(limit?: number): ResilienceEvent[];
    private recordEvent;
}
