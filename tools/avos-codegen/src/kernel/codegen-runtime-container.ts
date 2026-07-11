import {
  CodeGenConfigurationEngine,
} from "../configuration/codegen-configuration-engine";
import {
  CodeGenRuntimeDiagnostics,
} from "../diagnostics/codegen-runtime-diagnostics";
import {
  CodeGenManifestEngine,
} from "../manifest/codegen-manifest-engine";
import {
  CodeGenPluginRegistry,
} from "../plugins/codegen-plugin-registry";
import {
  CodeGenEngineRegistry,
} from "../registry/codegen-engine-registry";
import {
  CodeGenEventBus,
} from "../runtime/codegen-event-bus";

export class CodeGenRuntimeContainer {
  constructor(
    readonly configuration =
      new CodeGenConfigurationEngine(),
    readonly manifests =
      new CodeGenManifestEngine(),
    readonly plugins =
      new CodeGenPluginRegistry(),
    readonly diagnostics =
      new CodeGenRuntimeDiagnostics(),
    readonly engines =
      new CodeGenEngineRegistry(),
    readonly events =
      new CodeGenEventBus(),
  ) {}

  snapshot() {
    return {
      configuration:
        this.configuration.snapshot(),
      manifests:
        this.manifests.list().length,
      plugins:
        this.plugins.list().length,
      diagnostics:
        this.diagnostics.snapshot(),
      engines:
        this.engines.count(),
      events:
        this.events.list().length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.configuration.clear();
    this.manifests.clear();
    this.plugins.clear();
    this.diagnostics.clear();
    this.engines.clear();
    this.events.clear();
  }
}
