import { RetryOptions } from "../interfaces/retry-options.interface";
export declare class RetryPolicyService {
    private readonly logger;
    execute<T>(operationName: string, operation: (attempt: number) => Promise<T>, options?: RetryOptions): Promise<T>;
    private delay;
    private normalizeInteger;
}
