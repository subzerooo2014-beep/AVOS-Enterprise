export declare class AiRetryPolicyService {
    run<T>(fn: () => Promise<T>, attempts?: number): Promise<T>;
}
