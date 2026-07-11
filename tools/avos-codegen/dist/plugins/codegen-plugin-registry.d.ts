import { CodeGenPlugin, CodeGenRuntimeContext } from "../core/codegen.contracts";
export declare class CodeGenPluginRegistry {
    private readonly plugins;
    register(plugin: CodeGenPlugin, replace?: boolean): CodeGenPlugin;
    get(key: string): CodeGenPlugin;
    find(key: string): CodeGenPlugin | undefined;
    list(): readonly CodeGenPlugin[];
    listEnabled(): readonly CodeGenPlugin[];
    initializeAll(context: CodeGenRuntimeContext): Promise<void>;
    deactivateAll(context: CodeGenRuntimeContext): Promise<void>;
    remove(key: string): CodeGenPlugin;
    clear(): void;
    private resolveOrder;
}
//# sourceMappingURL=codegen-plugin-registry.d.ts.map