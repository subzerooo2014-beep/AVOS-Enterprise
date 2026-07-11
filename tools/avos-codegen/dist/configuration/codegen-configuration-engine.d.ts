import { CodeGenConfigurationEntry, CodeGenConfigurationSnapshot, CodeGenConfigurationSource, CodeGenJsonValue } from "../core/codegen.contracts";
export interface SetConfigurationOptions {
    source?: CodeGenConfigurationSource;
    readonly?: boolean;
    description?: string;
    overwrite?: boolean;
}
export declare class CodeGenConfigurationEngine {
    private readonly entries;
    set(key: string, value: CodeGenJsonValue, options?: SetConfigurationOptions): CodeGenConfigurationEntry;
    get<T extends CodeGenJsonValue>(key: string): T;
    find<T extends CodeGenJsonValue>(key: string): T | undefined;
    has(key: string): boolean;
    remove(key: string): CodeGenConfigurationEntry;
    list(): CodeGenConfigurationEntry[];
    snapshot(): CodeGenConfigurationSnapshot;
    loadDefaults(values: Record<string, CodeGenJsonValue>): void;
    loadEnvironment(prefix?: string): void;
    loadJsonFile(filePath: string): Promise<void>;
    clear(): void;
}
//# sourceMappingURL=codegen-configuration-engine.d.ts.map