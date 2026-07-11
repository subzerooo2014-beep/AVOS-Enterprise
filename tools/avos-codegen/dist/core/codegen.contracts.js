"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDiagnosticLevel = exports.CodeGenPluginStatus = exports.CodeGenManifestType = exports.CodeGenConfigurationSource = exports.CodeGenEventType = exports.CodeGenEventSeverity = exports.CodeGenEngineType = exports.CodeGenKernelStatus = void 0;
var CodeGenKernelStatus;
(function (CodeGenKernelStatus) {
    CodeGenKernelStatus["CREATED"] = "created";
    CodeGenKernelStatus["INITIALIZING"] = "initializing";
    CodeGenKernelStatus["READY"] = "ready";
    CodeGenKernelStatus["RUNNING"] = "running";
    CodeGenKernelStatus["STOPPING"] = "stopping";
    CodeGenKernelStatus["STOPPED"] = "stopped";
    CodeGenKernelStatus["FAILED"] = "failed";
})(CodeGenKernelStatus || (exports.CodeGenKernelStatus = CodeGenKernelStatus = {}));
var CodeGenEngineType;
(function (CodeGenEngineType) {
    CodeGenEngineType["KERNEL"] = "kernel";
    CodeGenEngineType["REGISTRY"] = "registry";
    CodeGenEngineType["TEMPLATE"] = "template";
    CodeGenEngineType["BLUEPRINT"] = "blueprint";
    CodeGenEngineType["GENERATOR"] = "generator";
    CodeGenEngineType["BUILDER"] = "builder";
    CodeGenEngineType["VALIDATOR"] = "validator";
    CodeGenEngineType["PIPELINE"] = "pipeline";
    CodeGenEngineType["PLUGIN"] = "plugin";
    CodeGenEngineType["MANIFEST"] = "manifest";
    CodeGenEngineType["DOCUMENTATION"] = "documentation";
    CodeGenEngineType["CUSTOM"] = "custom";
})(CodeGenEngineType || (exports.CodeGenEngineType = CodeGenEngineType = {}));
var CodeGenEventSeverity;
(function (CodeGenEventSeverity) {
    CodeGenEventSeverity["DEBUG"] = "debug";
    CodeGenEventSeverity["INFORMATIONAL"] = "informational";
    CodeGenEventSeverity["WARNING"] = "warning";
    CodeGenEventSeverity["ERROR"] = "error";
    CodeGenEventSeverity["CRITICAL"] = "critical";
})(CodeGenEventSeverity || (exports.CodeGenEventSeverity = CodeGenEventSeverity = {}));
var CodeGenEventType;
(function (CodeGenEventType) {
    CodeGenEventType["KERNEL_CREATED"] = "kernel_created";
    CodeGenEventType["KERNEL_INITIALIZING"] = "kernel_initializing";
    CodeGenEventType["KERNEL_READY"] = "kernel_ready";
    CodeGenEventType["KERNEL_STOPPING"] = "kernel_stopping";
    CodeGenEventType["KERNEL_STOPPED"] = "kernel_stopped";
    CodeGenEventType["KERNEL_FAILED"] = "kernel_failed";
    CodeGenEventType["ENGINE_REGISTERED"] = "engine_registered";
    CodeGenEventType["ENGINE_REPLACED"] = "engine_replaced";
    CodeGenEventType["ENGINE_REMOVED"] = "engine_removed";
    CodeGenEventType["PIPELINE_STARTED"] = "pipeline_started";
    CodeGenEventType["PIPELINE_COMPLETED"] = "pipeline_completed";
    CodeGenEventType["PIPELINE_FAILED"] = "pipeline_failed";
    CodeGenEventType["CUSTOM"] = "custom";
})(CodeGenEventType || (exports.CodeGenEventType = CodeGenEventType = {}));
var CodeGenConfigurationSource;
(function (CodeGenConfigurationSource) {
    CodeGenConfigurationSource["DEFAULT"] = "default";
    CodeGenConfigurationSource["FILE"] = "file";
    CodeGenConfigurationSource["ENVIRONMENT"] = "environment";
    CodeGenConfigurationSource["RUNTIME"] = "runtime";
    CodeGenConfigurationSource["PLUGIN"] = "plugin";
})(CodeGenConfigurationSource || (exports.CodeGenConfigurationSource = CodeGenConfigurationSource = {}));
var CodeGenManifestType;
(function (CodeGenManifestType) {
    CodeGenManifestType["SYSTEM"] = "system";
    CodeGenManifestType["ENGINE"] = "engine";
    CodeGenManifestType["PLUGIN"] = "plugin";
    CodeGenManifestType["BLUEPRINT"] = "blueprint";
    CodeGenManifestType["TEMPLATE"] = "template";
    CodeGenManifestType["GENERATOR"] = "generator";
    CodeGenManifestType["PIPELINE"] = "pipeline";
    CodeGenManifestType["CUSTOM"] = "custom";
})(CodeGenManifestType || (exports.CodeGenManifestType = CodeGenManifestType = {}));
var CodeGenPluginStatus;
(function (CodeGenPluginStatus) {
    CodeGenPluginStatus["DISCOVERED"] = "discovered";
    CodeGenPluginStatus["REGISTERED"] = "registered";
    CodeGenPluginStatus["INITIALIZING"] = "initializing";
    CodeGenPluginStatus["READY"] = "ready";
    CodeGenPluginStatus["DISABLED"] = "disabled";
    CodeGenPluginStatus["FAILED"] = "failed";
    CodeGenPluginStatus["REMOVED"] = "removed";
})(CodeGenPluginStatus || (exports.CodeGenPluginStatus = CodeGenPluginStatus = {}));
var CodeGenDiagnosticLevel;
(function (CodeGenDiagnosticLevel) {
    CodeGenDiagnosticLevel["DEBUG"] = "debug";
    CodeGenDiagnosticLevel["INFORMATIONAL"] = "informational";
    CodeGenDiagnosticLevel["WARNING"] = "warning";
    CodeGenDiagnosticLevel["ERROR"] = "error";
    CodeGenDiagnosticLevel["CRITICAL"] = "critical";
})(CodeGenDiagnosticLevel || (exports.CodeGenDiagnosticLevel = CodeGenDiagnosticLevel = {}));
//# sourceMappingURL=codegen.contracts.js.map