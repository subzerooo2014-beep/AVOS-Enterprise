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
exports.RuntimeResilienceBootstrapService = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const resilience_configuration_service_1 = require("../services/resilience-configuration.service");
const resilience_policy_service_1 = require("../services/resilience-policy.service");
const runtime_risk_evaluation_service_1 = require("../services/runtime-risk-evaluation.service");
const runtime_signal_service_1 = require("../services/runtime-signal.service");
const runtime_baseline_service_1 = require("../services/runtime-baseline.service");
let RuntimeResilienceBootstrapService = class RuntimeResilienceBootstrapService {
    constructor(store, configurations, policies, risk, signals, baselines) {
        this.store = store;
        this.configurations = configurations;
        this.policies = policies;
        this.risk = risk;
        this.signals = signals;
        this.baselines = baselines;
    }
    onModuleInit() {
        this.bootstrap();
    }
    bootstrap() {
        if (this.store.listConfigurations().length > 0 ||
            this.store.listPolicies().length > 0) {
            return;
        }
        const systemActor = {
            id: "avos-v8-bootstrap",
            type: "system",
            name: "AVOS V8 Runtime Bootstrap",
            roles: [
                "runtime_admin",
                "resilience_operator",
            ],
        };
        const configuration = this.configurations.create({
            key: "avos.runtime.resilience",
            name: "AVOS Runtime Resilience Configuration",
            description: "Default production runtime resilience configuration",
            environment: runtime_resilience_enums_1.RuntimeEnvironment.PRODUCTION,
            namespace: "avos-core",
            controlMode: runtime_resilience_enums_1.RuntimeControlMode.ENFORCE,
            changeType: runtime_resilience_enums_1.RuntimeChangeType.CONFIGURATION,
            payload: {
                automatedActionsEnabled: true,
                incidentAutoCreationEnabled: true,
                evidenceChainEnabled: true,
                maximumConcurrentActions: 5,
                defaultDryRun: true,
                rollbackRequired: true,
            },
            tags: [
                "production",
                "runtime",
                "resilience",
                "hardening-v8",
            ],
            requiresApproval: true,
            minimumApprovals: 2,
            actor: systemActor,
        });
        this.configurations.submit(configuration.id, {
            reason: "Initial AVOS V8 Mega Pack 3 bootstrap",
            context: {
                source: "module_bootstrap",
            },
            actor: systemActor,
        });
        this.configurations.approve(configuration.id, {
            decision: runtime_resilience_enums_1.ApprovalDecision.APPROVED,
            reason: "Bootstrap security approval",
            actor: {
                id: "avos-security-approver",
                type: "system",
                name: "AVOS Security Approver",
                roles: ["security_approver"],
            },
        });
        const approvedConfiguration = this.configurations.approve(configuration.id, {
            decision: runtime_resilience_enums_1.ApprovalDecision.APPROVED,
            reason: "Bootstrap operations approval",
            actor: {
                id: "avos-operations-approver",
                type: "system",
                name: "AVOS Operations Approver",
                roles: ["operations_approver"],
            },
        });
        this.configurations.activate(approvedConfiguration.id, systemActor);
        const policy = this.policies.create({
            key: "avos.runtime.change-risk",
            name: "AVOS Runtime Change Risk Policy",
            description: "Production rules for runtime changes and emergency operations",
            environment: runtime_resilience_enums_1.RuntimeEnvironment.PRODUCTION,
            namespace: "avos-core",
            defaultDecision: runtime_resilience_enums_1.RuntimeDecision.ALLOW_WITH_MONITORING,
            defaultRiskLevel: runtime_resilience_enums_1.RuntimeRiskLevel.MEDIUM,
            rules: [
                {
                    id: "critical-emergency-change",
                    name: "Block unsafe emergency changes",
                    description: "Blocks critical emergency changes without rollback readiness",
                    priority: 1000,
                    enabled: true,
                    conditions: [
                        {
                            field: "changeType",
                            operator: "eq",
                            value: runtime_resilience_enums_1.RuntimeChangeType.EMERGENCY,
                        },
                        {
                            field: "rollbackReady",
                            operator: "eq",
                            value: false,
                        },
                    ],
                    decision: runtime_resilience_enums_1.RuntimeDecision.BLOCK,
                    riskLevel: runtime_resilience_enums_1.RuntimeRiskLevel.CRITICAL,
                    requiredApprovals: 3,
                    actionTypes: [
                        runtime_resilience_enums_1.ResilienceActionType.LOCKDOWN,
                        runtime_resilience_enums_1.ResilienceActionType.NOTIFY,
                    ],
                    metadata: {
                        category: "emergency_protection",
                    },
                },
                {
                    id: "high-blast-radius-change",
                    name: "Require approval for wide blast radius",
                    description: "Requires approval when blast radius is high",
                    priority: 900,
                    enabled: true,
                    conditions: [
                        {
                            field: "blastRadius",
                            operator: "gte",
                            value: 70,
                        },
                    ],
                    decision: runtime_resilience_enums_1.RuntimeDecision.REQUIRE_APPROVAL,
                    riskLevel: runtime_resilience_enums_1.RuntimeRiskLevel.HIGH,
                    requiredApprovals: 2,
                    actionTypes: [
                        runtime_resilience_enums_1.ResilienceActionType.NOTIFY,
                    ],
                    metadata: {
                        category: "blast_radius",
                    },
                },
                {
                    id: "low-test-coverage",
                    name: "Monitor low test coverage",
                    description: "Adds monitoring requirements for low coverage",
                    priority: 800,
                    enabled: true,
                    conditions: [
                        {
                            field: "testCoverage",
                            operator: "lt",
                            value: 75,
                        },
                    ],
                    decision: runtime_resilience_enums_1.RuntimeDecision.ALLOW_WITH_MONITORING,
                    riskLevel: runtime_resilience_enums_1.RuntimeRiskLevel.MEDIUM,
                    requiredApprovals: 1,
                    actionTypes: [
                        runtime_resilience_enums_1.ResilienceActionType.NOTIFY,
                    ],
                    metadata: {
                        category: "quality_gate",
                    },
                },
            ],
            actor: systemActor,
        });
        const activePolicy = this.policies.activate(policy.id, systemActor);
        this.risk.evaluate({
            configurationId: configuration.id,
            policyId: activePolicy.id,
            environment: runtime_resilience_enums_1.RuntimeEnvironment.PRODUCTION,
            namespace: "avos-core",
            changeType: runtime_resilience_enums_1.RuntimeChangeType.CONFIGURATION,
            context: {
                blastRadius: 20,
                rollbackReady: true,
                testCoverage: 95,
                activeIncidents: 0,
            },
            actor: systemActor,
        });
        this.signals.record({
            source: "avos-runtime-bootstrap",
            environment: runtime_resilience_enums_1.RuntimeEnvironment.PRODUCTION,
            namespace: "avos-core",
            service: "runtime-resilience-control-plane",
            type: runtime_resilience_enums_1.RuntimeSignalType.HEALTH,
            status: runtime_resilience_enums_1.RuntimeSignalStatus.HEALTHY,
            value: 1,
            unit: "boolean",
            thresholdWarning: 0.75,
            thresholdCritical: 0.5,
            message: "Runtime resilience control plane initialized",
            labels: {
                component: "production-hardening-v8",
                megaPack: "3",
            },
            metadata: {
                bootstrap: true,
            },
        });
        this.baselines.capture({
            key: "avos-runtime-baseline",
            name: "AVOS Runtime Resilience Baseline",
            environment: runtime_resilience_enums_1.RuntimeEnvironment.PRODUCTION,
            namespace: "avos-core",
            metadata: {
                source: "bootstrap",
                version: "v8-mega-pack-3",
            },
            actor: systemActor,
        });
    }
};
exports.RuntimeResilienceBootstrapService = RuntimeResilienceBootstrapService;
exports.RuntimeResilienceBootstrapService = RuntimeResilienceBootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        resilience_configuration_service_1.ResilienceConfigurationService,
        resilience_policy_service_1.ResiliencePolicyService,
        runtime_risk_evaluation_service_1.RuntimeRiskEvaluationService,
        runtime_signal_service_1.RuntimeSignalService,
        runtime_baseline_service_1.RuntimeBaselineService])
], RuntimeResilienceBootstrapService);
//# sourceMappingURL=runtime-resilience-bootstrap.service.js.map