export declare class OperationTimeoutError extends Error {
    readonly timeoutMs: number;
    readonly operationName: string;
    constructor(timeoutMs: number, operationName?: string);
}
export declare function withTimeout<T>(operation: Promise<T>, timeoutMs: number, operationName?: string): Promise<T>;
