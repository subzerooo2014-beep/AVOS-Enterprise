import { RuntimeEnvironment, RuntimeSignalStatus, RuntimeSignalType } from "../contracts/runtime-resilience.enums";
export declare class RecordRuntimeSignalDto {
    source: string;
    environment: RuntimeEnvironment;
    namespace: string;
    service: string;
    type: RuntimeSignalType;
    status: RuntimeSignalStatus;
    value: number;
    unit?: string;
    thresholdWarning?: number;
    thresholdCritical?: number;
    message?: string;
    labels?: Record<string, string>;
    metadata?: Record<string, unknown>;
    observedAt?: string;
}
