"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRuntimeContainer = void 0;
const codegen_configuration_engine_1 = require("../configuration/codegen-configuration-engine");
const codegen_runtime_diagnostics_1 = require("../diagnostics/codegen-runtime-diagnostics");
const codegen_manifest_engine_1 = require("../manifest/codegen-manifest-engine");
const codegen_plugin_registry_1 = require("../plugins/codegen-plugin-registry");
const codegen_engine_registry_1 = require("../registry/codegen-engine-registry");
const codegen_event_bus_1 = require("../runtime/codegen-event-bus");
class CodeGenRuntimeContainer {
    configuration;
    manifests;
    plugins;
    diagnostics;
    engines;
    events;
    constructor(configuration = new codegen_configuration_engine_1.CodeGenConfigurationEngine(), manifests = new codegen_manifest_engine_1.CodeGenManifestEngine(), plugins = new codegen_plugin_registry_1.CodeGenPluginRegistry(), diagnostics = new codegen_runtime_diagnostics_1.CodeGenRuntimeDiagnostics(), engines = new codegen_engine_registry_1.CodeGenEngineRegistry(), events = new codegen_event_bus_1.CodeGenEventBus()) {
        this.configuration = configuration;
        this.manifests = manifests;
        this.plugins = plugins;
        this.diagnostics = diagnostics;
        this.engines = engines;
        this.events = events;
    }
    snapshot() {
        return {
            configuration: this.configuration.snapshot(),
            manifests: this.manifests.list().length,
            plugins: this.plugins.list().length,
            diagnostics: this.diagnostics.snapshot(),
            engines: this.engines.count(),
            events: this.events.list().length,
            generatedAt: new Date().toISOString(),
        };
    }
    clear() {
        this.configuration.clear();
        this.manifests.clear();
        this.plugins.clear();
        this.diagnostics.clear();
        this.engines.clear();
        this.events.clear();
    }
}
exports.CodeGenRuntimeContainer = CodeGenRuntimeContainer;
//# sourceMappingURL=codegen-runtime-container.js.map