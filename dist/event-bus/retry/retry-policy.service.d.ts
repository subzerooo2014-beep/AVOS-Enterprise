export declare class RetryPolicyService {
    run<T>(handler: () => Promise<T>, attempts?: number): Promise<T>;
}
