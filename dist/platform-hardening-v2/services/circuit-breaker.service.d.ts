import { CircuitSnapshot } from "../contracts/circuit-snapshot.contract";
import { CircuitBreakerOptions } from "../interfaces/circuit-breaker-options.interface";
export declare class CircuitBreakerService {
    private readonly logger;
    private readonly circuits;
    execute<T>(circuitName: string, operation: () => Promise<T>, options?: CircuitBreakerOptions): Promise<T>;
    getSnapshot(circuitName: string): CircuitSnapshot | null;
    getAllSnapshots(): CircuitSnapshot[];
    reset(circuitName: string): CircuitSnapshot;
    private getOrCreateCircuit;
    private refreshOpenCircuit;
    private recordSuccess;
    private recordFailure;
    private toSnapshot;
    private toIsoDate;
    private normalizeInteger;
}
