export declare class CodeGenError extends Error {
    readonly code: string;
    readonly causeValue?: unknown | undefined;
    constructor(message: string, code?: string, causeValue?: unknown | undefined);
}
export declare class CodeGenValidationError extends CodeGenError {
    constructor(message: string, causeValue?: unknown);
}
export declare class CodeGenEngineNotFoundError extends CodeGenError {
    constructor(key: string);
}
export declare class CodeGenDuplicateEngineError extends CodeGenError {
    constructor(key: string);
}
export declare class CodeGenKernelStateError extends CodeGenError {
    constructor(message: string);
}
//# sourceMappingURL=codegen.errors.d.ts.map