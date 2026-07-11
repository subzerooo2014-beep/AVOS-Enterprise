export interface CodeGenCapabilityMatchResult {
    compatible: boolean;
    matched: string[];
    missing: string[];
    extra: string[];
    score: number;
}
export declare class CodeGenCapabilityResolver {
    resolve(required: readonly string[], available: readonly string[]): CodeGenCapabilityMatchResult;
}
//# sourceMappingURL=codegen-capability-resolver.d.ts.map