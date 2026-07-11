"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseBuildCoordinatorV2 = void 0;
const codegen_artifact_graph_builder_v2_1 = require("../graph-v2/codegen-artifact-graph-builder-v2");
const codegen_enterprise_runtime_diagnostics_1 = require("../diagnostics/codegen-enterprise-runtime-diagnostics");
const codegen_enterprise_runtime_health_monitor_1 = require("../health/codegen-enterprise-runtime-health-monitor");
const codegen_enterprise_runtime_logger_1 = require("../logging/codegen-enterprise-runtime-logger");
const codegen_workspace_scanner_1 = require("../workspace/codegen-workspace-scanner");
const codegen_workspace_synchronizer_1 = require("../workspace/codegen-workspace-synchronizer");
class CodeGenEnterpriseBuildCoordinatorV2 {
    graph;
    diagnostics;
    health;
    logger;
    scanner;
    synchronizer;
    constructor(graph = new codegen_artifact_graph_builder_v2_1.CodeGenArtifactGraphBuilderV2(), diagnostics = new codegen_enterprise_runtime_diagnostics_1.CodeGenEnterpriseRuntimeDiagnostics(), health = new codegen_enterprise_runtime_health_monitor_1.CodeGenEnterpriseRuntimeHealthMonitor(), logger = new codegen_enterprise_runtime_logger_1.CodeGenEnterpriseRuntimeLogger(), scanner = new codegen_workspace_scanner_1.CodeGenWorkspaceScanner(), synchronizer = new codegen_workspace_synchronizer_1.CodeGenWorkspaceSynchronizer()) {
        this.graph = graph;
        this.diagnostics = diagnostics;
        this.health = health;
        this.logger = logger;
        this.scanner = scanner;
        this.synchronizer = synchronizer;
    }
    async execute(input) {
        this.logger.log(codegen_enterprise_runtime_logger_1.CodeGenRuntimeLogLevel.INFORMATIONAL, "Enterprise build coordination started", {
            artifacts: input.artifacts.length,
            dryRun: input.dryRun,
        });
        const graph = this.graph.build(input.artifacts);
        const workspace = input.scanWorkspace
            ? await this.scanner.scan(input.workspaceRoot)
            : undefined;
        const diagnostics = this.diagnostics.analyze({
            graph,
            ...(workspace
                ? {
                    workspace,
                }
                : {}),
        });
        const health = this.health.evaluate(diagnostics);
        if (health.status ===
            "unhealthy") {
            this.logger.log(codegen_enterprise_runtime_logger_1.CodeGenRuntimeLogLevel.ERROR, "Enterprise build coordination blocked", {
                critical: health.critical,
                errors: health.errors,
            });
            return {
                success: false,
                graph,
                workspace,
                diagnostics,
                health,
                synchronization: undefined,
                logs: this.logger.list(),
            };
        }
        const synchronization = await this.synchronizer.synchronize(input.targetRoot, input.artifacts, input.dryRun);
        const success = synchronization.failed.length ===
            0;
        this.logger.log(success
            ? codegen_enterprise_runtime_logger_1.CodeGenRuntimeLogLevel.INFORMATIONAL
            : codegen_enterprise_runtime_logger_1.CodeGenRuntimeLogLevel.WARNING, success
            ? "Enterprise build coordination completed"
            : "Enterprise build coordination completed with failures", {
            written: synchronization.written.length,
            unchanged: synchronization.unchanged.length,
            failed: synchronization.failed.length,
        });
        return {
            success,
            graph,
            workspace,
            diagnostics,
            health,
            synchronization,
            logs: this.logger.list(),
        };
    }
}
exports.CodeGenEnterpriseBuildCoordinatorV2 = CodeGenEnterpriseBuildCoordinatorV2;
//# sourceMappingURL=codegen-enterprise-build-coordinator-v2.js.map