import { CodeGenConfigurationEngine } from "../configuration/codegen-configuration-engine";
import { CodeGenRuntimeDiagnostics } from "../diagnostics/codegen-runtime-diagnostics";
import { CodeGenManifestEngine } from "../manifest/codegen-manifest-engine";
import { CodeGenPluginRegistry } from "../plugins/codegen-plugin-registry";
import { CodeGenEngineRegistry } from "../registry/codegen-engine-registry";
import { CodeGenEventBus } from "../runtime/codegen-event-bus";
export declare class CodeGenRuntimeContainer {
    readonly configuration: CodeGenConfigurationEngine;
    readonly manifests: CodeGenManifestEngine;
    readonly plugins: CodeGenPluginRegistry;
    readonly diagnostics: CodeGenRuntimeDiagnostics;
    readonly engines: CodeGenEngineRegistry;
    readonly events: CodeGenEventBus;
    constructor(configuration?: CodeGenConfigurationEngine, manifests?: CodeGenManifestEngine, plugins?: CodeGenPluginRegistry, diagnostics?: CodeGenRuntimeDiagnostics, engines?: CodeGenEngineRegistry, events?: CodeGenEventBus);
    snapshot(): {
        configuration: import("..").CodeGenConfigurationSnapshot;
        manifests: number;
        plugins: number;
        diagnostics: import("..").CodeGenDiagnosticsSnapshot;
        engines: number;
        events: number;
        generatedAt: string;
    };
    clear(): void;
}
//# sourceMappingURL=codegen-runtime-container.d.ts.map