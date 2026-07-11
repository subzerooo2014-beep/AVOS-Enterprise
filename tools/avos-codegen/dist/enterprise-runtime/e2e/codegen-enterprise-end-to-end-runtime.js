"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseEndToEndRuntime = void 0;
const codegen_enterprise_runtime_orchestrator_1 = require("../orchestration/codegen-enterprise-runtime-orchestrator");
const codegen_production_readiness_analyzer_1 = require("../readiness/codegen-production-readiness-analyzer");
const codegen_final_diagnostics_aggregator_1 = require("../finalization/codegen-final-diagnostics-aggregator");
class CodeGenEnterpriseEndToEndRuntime {
    orchestrator;
    readiness;
    diagnostics;
    constructor(orchestrator = new codegen_enterprise_runtime_orchestrator_1.CodeGenEnterpriseRuntimeOrchestrator(), readiness = new codegen_production_readiness_analyzer_1.CodeGenProductionReadinessAnalyzer(), diagnostics = new codegen_final_diagnostics_aggregator_1.CodeGenFinalDiagnosticsAggregator()) {
        this.orchestrator = orchestrator;
        this.readiness = readiness;
        this.diagnostics = diagnostics;
    }
    async execute(request) {
        const startedAt = new Date().toISOString();
        const orchestration = await this.orchestrator.execute({
            sessionId: request.sessionId,
            workspaceRoot: request.workspaceRoot,
            targetRoot: request.targetRoot,
            artifacts: request.artifacts,
            maximumWorkers: request.maximumWorkers,
            enableRetry: request.enableRetry,
            dryRun: request.dryRun,
            metadata: request.metadata,
        });
        const checks = [
            {
                key: "orchestration-success",
                name: "Orchestration Success",
                passed: orchestration.success,
                critical: true,
                message: orchestration.success
                    ? "Orchestration completed successfully"
                    : "Orchestration failed",
            },
            {
                key: "no-failed-tasks",
                name: "No Failed Tasks",
                passed: orchestration.batch.failed === 0,
                critical: true,
                message: orchestration.batch.failed === 0
                    ? "No failed tasks detected"
                    : `${orchestration.batch.failed} tasks failed`,
            },
            {
                key: "no-skipped-tasks",
                name: "No Skipped Tasks",
                passed: orchestration.batch.skipped === 0,
                critical: false,
                message: orchestration.batch.skipped === 0
                    ? "No skipped tasks detected"
                    : `${orchestration.batch.skipped} tasks were skipped`,
            },
            {
                key: "progress-complete",
                name: "Progress Complete",
                passed: orchestration.progress.percentage === 100,
                critical: true,
                message: orchestration.progress.percentage === 100
                    ? "Execution progress reached 100%"
                    : `Execution progress reached ${orchestration.progress.percentage}%`,
            },
            {
                key: "telemetry-present",
                name: "Telemetry Present",
                passed: orchestration.telemetry.spans.length > 0,
                critical: false,
                message: orchestration.telemetry.spans.length > 0
                    ? "Telemetry spans were recorded"
                    : "No telemetry spans were recorded",
            },
        ];
        const readiness = this.readiness.analyze(request.validateReadiness
            ? checks
            : []);
        const final = this.diagnostics.aggregate({
            diagnostics: [],
            checks: readiness.checks,
        });
        const completedAt = new Date().toISOString();
        return {
            success: orchestration.success &&
                (!request.validateReadiness ||
                    readiness.ready),
            orchestration,
            readiness,
            warnings: [
                ...orchestration.warnings,
                ...final.warnings,
            ],
            errors: [
                ...orchestration.errors,
                ...final.errors,
            ],
            startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(startedAt),
        };
    }
}
exports.CodeGenEnterpriseEndToEndRuntime = CodeGenEnterpriseEndToEndRuntime;
//# sourceMappingURL=codegen-enterprise-end-to-end-runtime.js.map