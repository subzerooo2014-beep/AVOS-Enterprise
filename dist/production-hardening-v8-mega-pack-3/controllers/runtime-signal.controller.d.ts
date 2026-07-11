import { RuntimeSignalStatus } from "../contracts/runtime-resilience.enums";
import { RecordRuntimeSignalDto } from "../dto";
import { RuntimeSignalService } from "../services/runtime-signal.service";
export declare class RuntimeSignalController {
    private readonly signals;
    constructor(signals: RuntimeSignalService);
    record(dto: RecordRuntimeSignalDto): import("..").RuntimeSignal;
    list(environment?: string, namespace?: string, service?: string, status?: RuntimeSignalStatus): import("..").RuntimeSignal[];
    summary(environment?: string, namespace?: string, service?: string): {
        total: number;
        healthy: number;
        degraded: number;
        unhealthy: number;
        unknown: number;
        latestObservedAt?: string;
    };
    get(id: string): import("..").RuntimeSignal;
}
