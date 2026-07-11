export declare class CodeGenFeatureFlagEngine {
    isEnabled(featureFlags: Readonly<Record<string, boolean>>, key: string, defaultValue?: boolean): boolean;
    requireEnabled(featureFlags: Readonly<Record<string, boolean>>, keys: readonly string[]): string[];
}
//# sourceMappingURL=codegen-feature-flag-engine.d.ts.map