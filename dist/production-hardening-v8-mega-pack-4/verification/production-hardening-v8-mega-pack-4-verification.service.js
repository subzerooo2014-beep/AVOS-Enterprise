"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV8MegaPack4VerificationService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const services_1 = require("../services");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let ProductionHardeningV8MegaPack4VerificationService = class ProductionHardeningV8MegaPack4VerificationService {
    constructor(store, controlMode, changeWindows, dependencies, slos, capacity, matrix, runbooks, checkpoints, archives, retention, audit, dashboard, operations, lifecycle, status) {
        this.store = store;
        this.controlMode = controlMode;
        this.changeWindows = changeWindows;
        this.dependencies = dependencies;
        this.slos = slos;
        this.capacity = capacity;
        this.matrix = matrix;
        this.runbooks = runbooks;
        this.checkpoints = checkpoints;
        this.archives = archives;
        this.retention = retention;
        this.audit = audit;
        this.dashboard = dashboard;
        this.operations = operations;
        this.lifecycle = lifecycle;
        this.status = status;
    }
    async run() {
        this.store.clear();
        const actor = {
            id: "avos-v8-mega-pack-4-verifier",
            type: "system",
            name: "AVOS V8 Mega Pack 4 Verifier",
            roles: [
                "runtime_governance",
                "verification",
                "platform_admin",
            ],
        };
        const checks = [];
        const controlMode = this.controlMode.get();
        checks.push({
            name: "control_mode_initialized",
            passed: controlMode.controlMode ===
                "enforce",
            details: controlMode,
        });
        const now = Date.now();
        const changeWindow = this.changeWindows.create({
            key: "verification-standard-window",
            name: "Verification Standard Window",
            description: "Mega Pack 4 verification window",
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            type: contracts_1.ChangeWindowType.STANDARD,
            startsAt: new Date(now - 60000).toISOString(),
            endsAt: new Date(now + 3600000).toISOString(),
            timezone: "Asia/Dubai",
            allowedRequestTypes: [
                contracts_1.GovernanceRequestType.DEPLOYMENT,
                contracts_1.GovernanceRequestType.CONFIGURATION_CHANGE,
            ],
            blockedRequestTypes: [],
            maximumRiskLevel: contracts_1.GovernanceRiskLevel.HIGH,
            requiresApproval: true,
            requiredApprovalCount: 1,
            tags: [
                "verification",
            ],
            metadata: {},
            actor,
        });
        const openedWindow = this.changeWindows.updateStatus(changeWindow.id, {
            status: contracts_1.ChangeWindowStatus.SCHEDULED,
            reason: "Verification schedule",
            actor,
        });
        const normalizedWindow = this.changeWindows.get(openedWindow.id);
        checks.push({
            name: "change_window_created",
            passed: Boolean(normalizedWindow.id),
            details: normalizedWindow.status,
        });
        const databaseNode = this.dependencies.createNode({
            key: "verification-database",
            name: "Verification Database",
            type: contracts_1.DependencyNodeType.DATABASE,
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            service: "verification-api",
            criticality: 90,
            healthStatus: contracts_1.DependencyHealthStatus.HEALTHY,
            healthScore: 100,
            region: "uae",
            zone: "primary",
            owner: "platform",
            tags: [
                "verification",
            ],
            metadata: {},
        });
        const serviceNode = this.dependencies.createNode({
            key: "verification-api",
            name: "Verification API",
            type: contracts_1.DependencyNodeType.SERVICE,
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            service: "verification-api",
            criticality: 80,
            healthStatus: contracts_1.DependencyHealthStatus.HEALTHY,
            healthScore: 100,
            region: "uae",
            zone: "primary",
            owner: "platform",
            tags: [
                "verification",
            ],
            metadata: {},
        });
        const dependencyEdge = this.dependencies.createEdge({
            sourceNodeId: serviceNode.id,
            targetNodeId: databaseNode.id,
            relationshipType: "hard",
            criticality: 90,
            timeoutMilliseconds: 3000,
            retryEnabled: true,
            metadata: {},
        });
        checks.push({
            name: "dependency_graph_created",
            passed: Boolean(dependencyEdge.id) &&
                this.store
                    .listDependencyNodes()
                    .length === 2,
            details: {
                nodes: this.store
                    .listDependencyNodes()
                    .length,
                edges: this.store
                    .listDependencyEdges()
                    .length,
            },
        });
        const slo = this.slos.create({
            key: "verification-availability",
            name: "Verification Availability",
            description: "Availability verification SLO",
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            service: "verification-api",
            metric: "availability_percentage",
            target: 99.9,
            warningThreshold: 99.5,
            breachThreshold: 99,
            evaluationWindowMinutes: 5,
            enabled: true,
            metadata: {},
            actor,
        });
        const sloEvaluation = this.slos.evaluate(slo.id, {
            actualValue: 99.95,
            observedAt: new Date().toISOString(),
            metadata: {},
        });
        checks.push({
            name: "slo_evaluation_compliant",
            passed: sloEvaluation.complianceStatus ===
                "compliant",
            details: sloEvaluation,
        });
        const capacityPolicy = this.capacity.create({
            key: "verification-cpu",
            name: "Verification CPU Policy",
            description: "Verification capacity policy",
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            service: "verification-api",
            metricType: "cpu",
            metricName: "cpu_percentage",
            thresholds: {
                warning: 70,
                critical: 90,
                scaleOut: 80,
                scaleIn: 25,
            },
            minimumInstances: 1,
            maximumInstances: 10,
            scaleStep: 1,
            cooldownSeconds: 60,
            allowAutomaticScaling: true,
            blockChangesWhenCritical: true,
            metadata: {},
            actor,
        });
        const capacityEvaluation = this.capacity.evaluate(capacityPolicy.id, {
            actualValue: 40,
            currentInstances: 2,
            observedAt: new Date().toISOString(),
            metadata: {},
        });
        checks.push({
            name: "capacity_evaluation_healthy",
            passed: capacityEvaluation.status ===
                "healthy",
            details: capacityEvaluation,
        });
        const matrixRule = this.matrix.createRule({
            name: "Verification Standard Approval",
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            requestTypes: [
                contracts_1.GovernanceRequestType.DEPLOYMENT,
            ],
            minimumRiskLevel: contracts_1.GovernanceRiskLevel.LOW,
            maximumRiskLevel: contracts_1.GovernanceRiskLevel.HIGH,
            minimumBlastRadius: 0,
            minimumBusinessCriticality: 0,
            rollbackPlanRequired: true,
            minimumTestCoverage: 75,
            tier: contracts_1.GovernanceApprovalTier.STANDARD,
            requiredApprovals: 1,
            requiredRoles: [
                "platform_admin",
            ],
            enabled: true,
            priority: 100,
            metadata: {},
        });
        checks.push({
            name: "approval_matrix_rule_created",
            passed: Boolean(matrixRule.id),
            details: matrixRule.tier,
        });
        const runbook = this.runbooks.create({
            key: "verification-deployment-runbook",
            name: "Verification Deployment Runbook",
            description: "Mega Pack 4 runbook verification",
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            service: "verification-api",
            requestTypes: [
                contracts_1.GovernanceRequestType.DEPLOYMENT,
            ],
            minimumRiskLevel: contracts_1.GovernanceRiskLevel.INFORMATIONAL,
            maximumRiskLevel: contracts_1.GovernanceRiskLevel.HIGH,
            requiresApproval: false,
            requiredRoles: [],
            steps: [
                {
                    id: "verify-preflight",
                    name: "Verify Preflight",
                    description: "Verify runtime preflight",
                    type: contracts_1.RuntimeRunbookStepType.VALIDATE,
                    order: 1,
                    required: true,
                    timeoutSeconds: 30,
                    retryLimit: 0,
                    continueOnFailure: false,
                    parameters: {
                        verification: true,
                    },
                },
                {
                    id: "verify-health",
                    name: "Verify Health",
                    description: "Verify runtime health",
                    type: contracts_1.RuntimeRunbookStepType.HEALTH_CHECK,
                    order: 2,
                    required: true,
                    timeoutSeconds: 30,
                    retryLimit: 0,
                    continueOnFailure: false,
                    parameters: {
                        verification: true,
                    },
                },
            ],
            tags: [
                "verification",
            ],
            metadata: {},
            actor,
        });
        const activeRunbook = this.runbooks.updateStatus(runbook.id, {
            status: contracts_1.RuntimeRunbookStatus.ACTIVE,
            reason: "Verification activation",
            actor,
        });
        checks.push({
            name: "runbook_activated",
            passed: activeRunbook.status ===
                contracts_1.RuntimeRunbookStatus.ACTIVE,
            details: activeRunbook.version,
        });
        const runbookExecution = await this.runbooks.execute(activeRunbook.id, {
            dryRun: true,
            runtimeContext: {
                verification: true,
            },
            actor,
        });
        checks.push({
            name: "runbook_execution_succeeded",
            passed: runbookExecution.status ===
                "succeeded",
            details: {
                status: runbookExecution.status,
                steps: runbookExecution
                    .stepExecutions
                    .length,
            },
        });
        const checkpoint = this.checkpoints.create({
            key: "verification-full-checkpoint",
            name: "Verification Full Checkpoint",
            description: "Mega Pack 4 verification checkpoint",
            type: contracts_1.GovernanceCheckpointType.BASELINE,
            scope: contracts_1.GovernanceSnapshotScope.FULL,
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            service: "verification-api",
            metadata: {},
            actor,
        });
        const checkpointVerification = this.checkpoints.verify(checkpoint.id);
        checks.push({
            name: "checkpoint_verified",
            passed: checkpointVerification.valid,
            details: checkpointVerification,
        });
        const restoreReadyCheckpoint = this.checkpoints.markRestoreReady(checkpoint.id);
        checks.push({
            name: "checkpoint_restore_ready",
            passed: restoreReadyCheckpoint.status ===
                "restore_ready",
            details: restoreReadyCheckpoint.status,
        });
        const retentionPolicy = this.retention.create({
            key: "verification-retention",
            name: "Verification Retention Policy",
            description: "Verification archive retention",
            archiveTypes: [
                contracts_1.GovernanceArchiveType.CHECKPOINT,
                contracts_1.GovernanceArchiveType.FULL_EXPORT,
            ],
            classifications: [
                contracts_1.GovernanceDataClassification.INTERNAL,
            ],
            retentionDays: 365,
            archiveAfterDays: 30,
            compressAfterDays: 60,
            redactAfterDays: 300,
            deleteAfterDays: 365,
            legalHold: false,
            immutable: true,
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            metadata: {},
            actor,
        });
        checks.push({
            name: "retention_policy_created",
            passed: retentionPolicy.status ===
                "active",
            details: retentionPolicy.retentionDays,
        });
        const archive = this.archives.create({
            type: contracts_1.GovernanceArchiveType.CHECKPOINT,
            name: "Verification Checkpoint Archive",
            description: "Archive generated from verified checkpoint",
            classification: contracts_1.GovernanceDataClassification.INTERNAL,
            environment: contracts_1.GovernanceEnvironment.PRODUCTION,
            namespace: "avos",
            sourceResourceIds: [
                checkpoint.id,
            ],
            checkpointId: checkpoint.id,
            compressed: true,
            encrypted: true,
            immutable: true,
            retentionPolicyId: retentionPolicy.id,
            metadata: {},
            actor,
        });
        const archiveVerification = this.archives.verify(archive.id);
        checks.push({
            name: "archive_verified",
            passed: archiveVerification.valid,
            details: archiveVerification,
        });
        const auditIntegrity = this.audit.verify();
        checks.push({
            name: "audit_chain_verified",
            passed: auditIntegrity.valid,
            details: auditIntegrity,
        });
        const dashboard = this.dashboard.snapshot();
        checks.push({
            name: "dashboard_available",
            passed: Boolean(dashboard.system) &&
                dashboard.evidenceChainVerified,
            details: {
                healthStatus: dashboard.healthStatus,
                auditEntries: dashboard.auditEntries,
            },
        });
        const operations = this.operations.snapshot();
        checks.push({
            name: "operations_snapshot_available",
            passed: Boolean(operations.generatedAt),
            details: operations,
        });
        const lifecycle = this.lifecycle.snapshot();
        checks.push({
            name: "data_lifecycle_snapshot_available",
            passed: lifecycle.checkpoints >= 1 &&
                lifecycle.archives >= 1,
            details: lifecycle,
        });
        const status = this.status.snapshot();
        checks.push({
            name: "system_status_available",
            passed: status.success === true &&
                status.evidenceChainVerified ===
                    true &&
                status.executionEvidenceVerified ===
                    true,
            details: {
                healthStatus: status.healthStatus,
                controlMode: status.controlMode,
            },
        });
        const passed = checks.filter((check) => check.passed).length;
        const failed = checks.length -
            passed;
        return {
            success: failed === 0,
            system: "AVOS Production Hardening V8 — Mega Pack 4",
            version: "v8-mega-pack-4",
            healthStatus: failed === 0
                ? "healthy"
                : "unhealthy",
            evidenceChainVerified: auditIntegrity.valid,
            executionEvidenceVerified: status.executionEvidenceVerified,
            controlMode: status.controlMode,
            changeWindows: status.changeWindows,
            dependencyNodes: status.dependencyNodes,
            dependencyEdges: status.dependencyEdges,
            sloDefinitions: status.sloDefinitions,
            sloEvaluations: status.sloEvaluations,
            capacityPolicies: status.capacityPolicies,
            capacityEvaluations: status.capacityEvaluations,
            approvalMatrixRules: status.approvalMatrixRules,
            runbooks: status.runbooks,
            activeRunbooks: status.activeRunbooks,
            runbookExecutions: status.runbookExecutions,
            checkpoints: status.checkpoints,
            verifiedCheckpoints: status.verifiedCheckpoints,
            retentionPolicies: status.retentionPolicies,
            archives: status.archives,
            verifiedArchives: status.verifiedArchives,
            auditEntries: status.auditEntries,
            verificationChecksPassed: passed,
            verificationChecksFailed: failed,
            checks,
            verifiedAt: new Date().toISOString(),
        };
    }
};
exports.ProductionHardeningV8MegaPack4VerificationService = ProductionHardeningV8MegaPack4VerificationService;
exports.ProductionHardeningV8MegaPack4VerificationService = ProductionHardeningV8MegaPack4VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        services_1.RuntimeGovernanceControlModeService,
        services_1.RuntimeChangeWindowService,
        services_1.RuntimeDependencyGraphService,
        services_1.RuntimeSloService,
        services_1.RuntimeCapacityGovernanceService,
        services_1.RuntimeGovernanceApprovalMatrixService,
        services_1.RuntimeRunbookService,
        services_1.RuntimeGovernanceCheckpointService,
        services_1.RuntimeGovernanceArchiveService,
        services_1.RuntimeGovernanceRetentionService,
        services_1.RuntimeGovernanceAuditService,
        services_1.RuntimeGovernanceDashboardService,
        services_1.RuntimeGovernanceOperationsStatusService,
        services_1.RuntimeGovernanceDataLifecycleStatusService,
        services_1.ProductionHardeningV8MegaPack4StatusService])
], ProductionHardeningV8MegaPack4VerificationService);
//# sourceMappingURL=production-hardening-v8-mega-pack-4-verification.service.js.map