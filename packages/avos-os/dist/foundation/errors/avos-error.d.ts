export declare class AvosError extends Error {
    readonly code: string;
    readonly details?: any | undefined;
    constructor(message: string, code?: string, details?: any | undefined);
}
