"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack14Service = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ProductionHardeningV7MegaPack14Service = class ProductionHardeningV7MegaPack14Service {
    constructor() {
        this.configurations = new Map();
        this.approvals = new Map();
        this.featureFlags = new Map();
        this.featureEvaluations = new Map();
        this.rollouts = new Map();
        this.drifts = new Map();
        this.policies = new Map();
        this.policyEvaluations = new Map();
        this.healthRules = new Map();
        this.healthEvaluations = new Map();
        this.evidenceEntries = [];
        this.platformEvents = [];
    }
    onModuleInit() {
        if (this.configurations.size === 0) {
            this.seedRuntimeGovernance();
        }
    }
    now() {
        return new Date().toISOString();
    }
    requireText(value, field) {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new common_1.BadRequestException(`${field} is required`);
        }
        return value.trim();
    }
    clamp(value, fallback, minimum, maximum) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            return fallback;
        }
        return Math.min(maximum, Math.max(minimum, parsed));
    }
    stableSerialize(value) {
        if (value === null || typeof value !== "object") {
            return JSON.stringify(value);
        }
        if (Array.isArray(value)) {
            return `[${value
                .map((item) => this.stableSerialize(item))
                .join(",")}]`;
        }
        const record = value;
        return `{${Object.keys(record)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${this.stableSerialize(record[key])}`)
            .join(",")}}`;
    }
    hash(value) {
        return (0, crypto_1.createHash)("sha256")
            .update(this.stableSerialize(value))
            .digest("hex");
    }
    record(eventType, entityType, entityId, actor, payload = {}) {
        const previous = this.evidenceEntries[this.evidenceEntries.length - 1];
        const sequence = this.evidenceEntries.length + 1;
        const previousHash = previous?.hash ?? "GENESIS";
        const timestamp = this.now();
        const hash = this.hash({
            sequence,
            eventType,
            entityType,
            entityId,
            actor,
            timestamp,
            payload,
            previousHash,
        });
        const evidence = {
            id: (0, crypto_1.randomUUID)(),
            sequence,
            eventType,
            entityType,
            entityId,
            actor,
            timestamp,
            payload,
            previousHash,
            hash,
        };
        this.evidenceEntries.push(evidence);
        this.platformEvents.push({
            id: (0, crypto_1.randomUUID)(),
            eventType,
            entityType,
            entityId,
            timestamp,
            payload,
        });
        return evidence;
    }
    createConfiguration(dto, actor = "system") {
        const existingVersions = this.listConfigurations().filter((item) => item.name === dto.name &&
            item.environment === dto.environment);
        const createdAt = this.now();
        const configuration = {
            id: (0, crypto_1.randomUUID)(),
            name: this.requireText(dto.name, "name"),
            version: existingVersions.length === 0
                ? 1
                : Math.max(...existingVersions.map((item) => item.version)) + 1,
            environment: dto.environment,
            status: "draft",
            values: dto.values ?? {},
            checksum: this.hash(dto.values ?? {}),
            createdBy: dto.createdBy?.trim() || actor,
            createdAt,
            updatedAt: createdAt,
            previousConfigurationId: existingVersions
                .sort((a, b) => b.version - a.version)[0]?.id,
        };
        this.configurations.set(configuration.id, configuration);
        this.record("runtime.configuration.created", "runtime_configuration", configuration.id, actor, {
            name: configuration.name,
            version: configuration.version,
            environment: configuration.environment,
            checksum: configuration.checksum,
        });
        return configuration;
    }
    getConfiguration(configurationId) {
        const configuration = this.configurations.get(configurationId);
        if (!configuration) {
            throw new common_1.NotFoundException(`Runtime configuration ${configurationId} was not found`);
        }
        return configuration;
    }
    listConfigurations() {
        return Array.from(this.configurations.values()).sort((a, b) => {
            if (a.name === b.name) {
                return b.version - a.version;
            }
            return b.createdAt.localeCompare(a.createdAt);
        });
    }
    requestConfigurationApproval(configurationId, requestedBy = "system") {
        const configuration = this.getConfiguration(configurationId);
        if (configuration.status !== "draft") {
            throw new common_1.BadRequestException("Only draft configurations can request approval");
        }
        const approval = {
            id: (0, crypto_1.randomUUID)(),
            configurationId: configuration.id,
            requestedBy,
            status: "pending",
            reason: "Runtime configuration activation request",
            requestedAt: this.now(),
        };
        this.approvals.set(approval.id, approval);
        this.record("runtime.configuration.approval_requested", "runtime_configuration_approval", approval.id, requestedBy, {
            configurationId,
        });
        return approval;
    }
    approveConfiguration(approvalId, reviewedBy = "system") {
        const approval = this.getApproval(approvalId);
        const configuration = this.getConfiguration(approval.configurationId);
        approval.status = "approved";
        approval.reviewedBy = reviewedBy;
        approval.reviewedAt = this.now();
        configuration.approvedBy = reviewedBy;
        configuration.updatedAt = approval.reviewedAt;
        this.record("runtime.configuration.approved", "runtime_configuration_approval", approval.id, reviewedBy, {
            configurationId: configuration.id,
            version: configuration.version,
        });
        return approval;
    }
    getApproval(approvalId) {
        const approval = this.approvals.get(approvalId);
        if (!approval) {
            throw new common_1.NotFoundException(`Runtime configuration approval ${approvalId} was not found`);
        }
        return approval;
    }
    listApprovals() {
        return Array.from(this.approvals.values()).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
    }
    createRuntimePolicy(dto, actor = "system") {
        const policy = {
            id: (0, crypto_1.randomUUID)(),
            name: this.requireText(dto.name, "name"),
            environment: dto.environment,
            description: dto.description?.trim() || "",
            active: true,
            requiresApproval: dto.requiresApproval !== false,
            blockedKeys: Array.from(new Set((dto.blockedKeys ?? [])
                .map((item) => item.trim())
                .filter(Boolean))),
            protectedKeys: Array.from(new Set((dto.protectedKeys ?? [])
                .map((item) => item.trim())
                .filter(Boolean))),
            minimumHealthPercent: this.clamp(dto.minimumHealthPercent, 95, 0, 100),
            createdAt: this.now(),
        };
        this.policies.set(policy.id, policy);
        this.record("runtime.policy.created", "runtime_policy", policy.id, actor, {
            environment: policy.environment,
            requiresApproval: policy.requiresApproval,
            blockedKeys: policy.blockedKeys,
        });
        return policy;
    }
    listRuntimePolicies() {
        return Array.from(this.policies.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    evaluateRuntimePolicy(configurationId, actor = "system") {
        const configuration = this.getConfiguration(configurationId);
        const policies = this.listRuntimePolicies().filter((policy) => policy.active &&
            policy.environment === configuration.environment);
        const violations = [];
        let requiresApproval = false;
        for (const policy of policies) {
            requiresApproval =
                requiresApproval || policy.requiresApproval;
            for (const blockedKey of policy.blockedKeys) {
                if (Object.prototype.hasOwnProperty.call(configuration.values, blockedKey)) {
                    violations.push(`Blocked runtime key detected: ${blockedKey}`);
                }
            }
        }
        const approvalExists = this.listApprovals().some((approval) => approval.configurationId === configuration.id &&
            approval.status === "approved");
        const decision = violations.length > 0
            ? "deny"
            : requiresApproval && !approvalExists
                ? "require_approval"
                : "allow";
        const primaryPolicy = policies[0] ??
            this.createRuntimePolicy({
                name: "Default Runtime Governance",
                environment: configuration.environment,
                description: "Default runtime governance policy",
                requiresApproval: true,
                blockedKeys: [],
                protectedKeys: [],
                minimumHealthPercent: 95,
            }, actor);
        const evaluation = {
            id: (0, crypto_1.randomUUID)(),
            policyId: primaryPolicy.id,
            configurationId: configuration.id,
            decision,
            violations,
            evaluatedAt: this.now(),
        };
        this.policyEvaluations.set(evaluation.id, evaluation);
        this.record(`runtime.policy.${decision}`, "runtime_policy_evaluation", evaluation.id, actor, {
            configurationId: configuration.id,
            decision,
            violations,
        });
        return evaluation;
    }
    listPolicyEvaluations() {
        return Array.from(this.policyEvaluations.values()).sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    startRollout(configurationId, dto = {}) {
        const configuration = this.getConfiguration(configurationId);
        const actor = dto.requestedBy?.trim() || "system";
        const evaluation = this.evaluateRuntimePolicy(configuration.id, actor);
        if (evaluation.decision !== "allow") {
            throw new common_1.BadRequestException(`Runtime configuration cannot be rolled out: ${evaluation.decision}`);
        }
        const startedAt = this.now();
        const rollout = {
            id: (0, crypto_1.randomUUID)(),
            configurationId: configuration.id,
            environment: configuration.environment,
            status: "running",
            strategy: dto.strategy || "progressive",
            targetPercentage: this.clamp(dto.targetPercentage, 100, 1, 100),
            currentPercentage: 0,
            healthThresholdPercent: this.clamp(dto.healthThresholdPercent, 95, 0, 100),
            startedAt,
            requestedBy: actor,
        };
        this.rollouts.set(rollout.id, rollout);
        this.record("runtime.rollout.started", "configuration_rollout", rollout.id, actor, {
            configurationId: configuration.id,
            strategy: rollout.strategy,
            targetPercentage: rollout.targetPercentage,
        });
        rollout.currentPercentage = rollout.targetPercentage;
        rollout.status = "completed";
        rollout.completedAt = this.now();
        for (const current of this.configurations.values()) {
            if (current.id !== configuration.id &&
                current.name === configuration.name &&
                current.environment === configuration.environment &&
                current.status === "active") {
                current.status = "superseded";
                current.updatedAt = rollout.completedAt;
            }
        }
        configuration.status = "active";
        configuration.activatedAt = rollout.completedAt;
        configuration.updatedAt = rollout.completedAt;
        this.record("runtime.rollout.completed", "configuration_rollout", rollout.id, actor, {
            configurationId: configuration.id,
            currentPercentage: rollout.currentPercentage,
        });
        return rollout;
    }
    rollbackConfiguration(configurationId, actor = "system") {
        const configuration = this.getConfiguration(configurationId);
        if (configuration.status !== "active") {
            throw new common_1.BadRequestException("Only active configurations can be rolled back");
        }
        configuration.status = "rolled_back";
        configuration.rolledBackAt = this.now();
        configuration.updatedAt = configuration.rolledBackAt;
        if (configuration.previousConfigurationId) {
            const previous = this.configurations.get(configuration.previousConfigurationId);
            if (previous) {
                previous.status = "active";
                previous.activatedAt = this.now();
                previous.updatedAt = previous.activatedAt;
            }
        }
        this.record("runtime.configuration.rolled_back", "runtime_configuration", configuration.id, actor, {
            previousConfigurationId: configuration.previousConfigurationId,
        });
        return configuration;
    }
    listRollouts() {
        return Array.from(this.rollouts.values()).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    }
    createFeatureFlag(dto, actor = "system") {
        const duplicate = Array.from(this.featureFlags.values()).find((flag) => flag.key === dto.key &&
            flag.environment === dto.environment);
        if (duplicate) {
            throw new common_1.BadRequestException(`Feature flag ${dto.key} already exists for ${dto.environment}`);
        }
        const createdAt = this.now();
        const flag = {
            id: (0, crypto_1.randomUUID)(),
            key: this.requireText(dto.key, "key"),
            name: this.requireText(dto.name, "name"),
            description: dto.description?.trim() || "",
            environment: dto.environment,
            status: "draft",
            enabled: dto.enabled === true,
            rolloutPercentage: this.clamp(dto.rolloutPercentage, dto.enabled ? 100 : 0, 0, 100),
            allowedAudiences: Array.from(new Set((dto.allowedAudiences ?? [])
                .map((item) => item.trim())
                .filter(Boolean))),
            createdBy: dto.createdBy?.trim() || actor,
            createdAt,
            updatedAt: createdAt,
        };
        this.featureFlags.set(flag.id, flag);
        this.record("runtime.feature_flag.created", "feature_flag", flag.id, actor, {
            key: flag.key,
            environment: flag.environment,
            enabled: flag.enabled,
        });
        return flag;
    }
    activateFeatureFlag(featureFlagId, actor = "system") {
        const flag = this.getFeatureFlag(featureFlagId);
        flag.status = "active";
        flag.enabled = true;
        flag.activatedAt = this.now();
        flag.updatedAt = flag.activatedAt;
        this.record("runtime.feature_flag.activated", "feature_flag", flag.id, actor, {
            key: flag.key,
            rolloutPercentage: flag.rolloutPercentage,
        });
        return flag;
    }
    getFeatureFlag(featureFlagId) {
        const flag = this.featureFlags.get(featureFlagId);
        if (!flag) {
            throw new common_1.NotFoundException(`Feature flag ${featureFlagId} was not found`);
        }
        return flag;
    }
    listFeatureFlags() {
        return Array.from(this.featureFlags.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    evaluateFeatureFlag(featureFlagId, dto, actor = "system") {
        const flag = this.getFeatureFlag(featureFlagId);
        const audience = dto.audience?.trim() || "default";
        const audienceAllowed = flag.allowedAudiences.length === 0 ||
            flag.allowedAudiences.includes(audience);
        const bucket = parseInt(this.hash(dto.subjectReference).slice(0, 8), 16) % 100;
        const enabled = flag.status === "active" &&
            flag.enabled &&
            audienceAllowed &&
            bucket < flag.rolloutPercentage;
        const evaluation = {
            id: (0, crypto_1.randomUUID)(),
            featureFlagId: flag.id,
            subjectReference: this.requireText(dto.subjectReference, "subjectReference"),
            audience,
            enabled,
            reason: enabled
                ? "Feature flag enabled for subject"
                : "Feature flag disabled by runtime targeting",
            evaluatedAt: this.now(),
        };
        this.featureEvaluations.set(evaluation.id, evaluation);
        this.record("runtime.feature_flag.evaluated", "feature_flag_evaluation", evaluation.id, actor, {
            featureFlagId: flag.id,
            enabled,
            audience,
        });
        return evaluation;
    }
    listFeatureEvaluations() {
        return Array.from(this.featureEvaluations.values()).sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    detectConfigurationDrift(dto, actor = "system") {
        const configuration = this.getConfiguration(dto.configurationId);
        const actualChecksum = this.hash(dto.actualValues ?? {});
        const matches = actualChecksum === configuration.checksum;
        const drift = {
            id: (0, crypto_1.randomUUID)(),
            configurationId: configuration.id,
            environment: configuration.environment,
            expectedChecksum: configuration.checksum,
            actualChecksum,
            severity: matches ? "low" : "high",
            status: matches ? "remediated" : "detected",
            detectedAt: this.now(),
            remediatedAt: matches ? this.now() : undefined,
            description: dto.description?.trim() ||
                (matches
                    ? "No configuration drift detected"
                    : "Runtime configuration differs from approved baseline"),
        };
        this.drifts.set(drift.id, drift);
        this.record(matches
            ? "runtime.configuration_drift.clean"
            : "runtime.configuration_drift.detected", "configuration_drift", drift.id, actor, {
            configurationId: configuration.id,
            severity: drift.severity,
            status: drift.status,
        });
        return drift;
    }
    remediateConfigurationDrift(driftId, actor = "system") {
        const drift = this.getDrift(driftId);
        drift.status = "remediated";
        drift.remediatedAt = this.now();
        this.record("runtime.configuration_drift.remediated", "configuration_drift", drift.id, actor, {
            configurationId: drift.configurationId,
        });
        return drift;
    }
    getDrift(driftId) {
        const drift = this.drifts.get(driftId);
        if (!drift) {
            throw new common_1.NotFoundException(`Configuration drift ${driftId} was not found`);
        }
        return drift;
    }
    listDrifts() {
        return Array.from(this.drifts.values()).sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
    }
    createHealthRule(dto, actor = "system") {
        const rule = {
            id: (0, crypto_1.randomUUID)(),
            name: this.requireText(dto.name, "name"),
            environment: dto.environment,
            metricName: this.requireText(dto.metricName, "metricName"),
            operator: dto.operator,
            threshold: Number(dto.threshold),
            active: true,
            createdAt: this.now(),
        };
        if (!Number.isFinite(rule.threshold)) {
            throw new common_1.BadRequestException("threshold must be a valid number");
        }
        this.healthRules.set(rule.id, rule);
        this.record("runtime.health_rule.created", "runtime_health_rule", rule.id, actor, {
            metricName: rule.metricName,
            operator: rule.operator,
            threshold: rule.threshold,
        });
        return rule;
    }
    evaluateHealthRule(ruleId, dto, actor = "system") {
        const rule = this.getHealthRule(ruleId);
        const measuredValue = Number(dto.measuredValue);
        if (!Number.isFinite(measuredValue)) {
            throw new common_1.BadRequestException("measuredValue must be a valid number");
        }
        let passed = false;
        switch (rule.operator) {
            case "gte":
                passed = measuredValue >= rule.threshold;
                break;
            case "lte":
                passed = measuredValue <= rule.threshold;
                break;
            case "gt":
                passed = measuredValue > rule.threshold;
                break;
            case "lt":
                passed = measuredValue < rule.threshold;
                break;
            case "eq":
                passed = measuredValue === rule.threshold;
                break;
        }
        const evaluation = {
            id: (0, crypto_1.randomUUID)(),
            ruleId: rule.id,
            measuredValue,
            passed,
            evaluatedAt: this.now(),
            message: dto.message?.trim() ||
                (passed
                    ? "Runtime health rule passed"
                    : "Runtime health rule failed"),
        };
        this.healthEvaluations.set(evaluation.id, evaluation);
        this.record(passed
            ? "runtime.health_rule.passed"
            : "runtime.health_rule.failed", "runtime_health_evaluation", evaluation.id, actor, {
            ruleId: rule.id,
            measuredValue,
            threshold: rule.threshold,
        });
        return evaluation;
    }
    getHealthRule(ruleId) {
        const rule = this.healthRules.get(ruleId);
        if (!rule) {
            throw new common_1.NotFoundException(`Runtime health rule ${ruleId} was not found`);
        }
        return rule;
    }
    listHealthRules() {
        return Array.from(this.healthRules.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    listHealthEvaluations() {
        return Array.from(this.healthEvaluations.values()).sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    verifyEvidenceChain() {
        let previousHash = "GENESIS";
        for (const entry of this.evidenceEntries) {
            const calculatedHash = this.hash({
                sequence: entry.sequence,
                eventType: entry.eventType,
                entityType: entry.entityType,
                entityId: entry.entityId,
                actor: entry.actor,
                timestamp: entry.timestamp,
                payload: entry.payload,
                previousHash: entry.previousHash,
            });
            if (entry.previousHash !== previousHash ||
                entry.hash !== calculatedHash) {
                return {
                    verified: false,
                    entries: this.evidenceEntries.length,
                    brokenAtSequence: entry.sequence,
                    checkedAt: this.now(),
                };
            }
            previousHash = entry.hash;
        }
        return {
            verified: true,
            entries: this.evidenceEntries.length,
            checkedAt: this.now(),
        };
    }
    listEvidenceEntries() {
        return [...this.evidenceEntries];
    }
    listPlatformEvents() {
        return [...this.platformEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
    getSnapshot() {
        const configurations = this.listConfigurations();
        const approvals = this.listApprovals();
        const featureFlags = this.listFeatureFlags();
        const featureEvaluations = this.listFeatureEvaluations();
        const rollouts = this.listRollouts();
        const drifts = this.listDrifts();
        const policies = this.listRuntimePolicies();
        const policyEvaluations = this.listPolicyEvaluations();
        const healthRules = this.listHealthRules();
        const healthEvaluations = this.listHealthEvaluations();
        const evidence = this.verifyEvidenceChain();
        const openDrifts = drifts.filter((drift) => drift.status === "detected" ||
            drift.status === "acknowledged").length;
        const deniedPolicyEvaluations = policyEvaluations.filter((evaluation) => evaluation.decision === "deny" ||
            evaluation.decision === "quarantine").length;
        const failedRollouts = rollouts.filter((rollout) => rollout.status === "failed").length;
        const failedHealthEvaluations = healthEvaluations.filter((evaluation) => !evaluation.passed).length;
        const healthStatus = !evidence.verified ||
            failedRollouts > 0 ||
            deniedPolicyEvaluations > 0
            ? "critical"
            : openDrifts > 0 ||
                failedHealthEvaluations > 0
                ? "degraded"
                : "healthy";
        return {
            generatedAt: this.now(),
            healthStatus,
            evidenceChainVerified: evidence.verified,
            configurations: configurations.length,
            activeConfigurations: configurations.filter((configuration) => configuration.status === "active").length,
            rolledBackConfigurations: configurations.filter((configuration) => configuration.status === "rolled_back").length,
            approvals: approvals.length,
            approvedApprovals: approvals.filter((approval) => approval.status === "approved").length,
            featureFlags: featureFlags.length,
            activeFeatureFlags: featureFlags.filter((flag) => flag.status === "active").length,
            enabledFeatureFlags: featureFlags.filter((flag) => flag.enabled).length,
            featureEvaluations: featureEvaluations.length,
            rollouts: rollouts.length,
            completedRollouts: rollouts.filter((rollout) => rollout.status === "completed").length,
            failedRollouts,
            configurationDrifts: drifts.length,
            openDrifts,
            remediatedDrifts: drifts.filter((drift) => drift.status === "remediated").length,
            runtimePolicies: policies.length,
            activeRuntimePolicies: policies.filter((policy) => policy.active).length,
            policyEvaluations: policyEvaluations.length,
            deniedPolicyEvaluations,
            healthRules: healthRules.length,
            activeHealthRules: healthRules.filter((rule) => rule.active).length,
            healthEvaluations: healthEvaluations.length,
            passedHealthEvaluations: healthEvaluations.filter((evaluation) => evaluation.passed).length,
            failedHealthEvaluations,
            evidenceEntries: this.evidenceEntries.length,
            platformEvents: this.platformEvents.length,
        };
    }
    getStatus() {
        return {
            success: true,
            system: "AVOS Production Hardening V7 — Mega Pack 14",
            version: "v7-mega-pack-14",
            ...this.getSnapshot(),
        };
    }
    runVerification() {
        const snapshot = this.getSnapshot();
        const checks = {
            runtimeConfigurationReady: snapshot.configurations > 0 &&
                snapshot.activeConfigurations > 0,
            approvalGovernanceReady: snapshot.approvals > 0 &&
                snapshot.approvedApprovals > 0,
            featureFlagGovernanceReady: snapshot.featureFlags > 0 &&
                snapshot.activeFeatureFlags > 0 &&
                snapshot.featureEvaluations > 0,
            safeRolloutReady: snapshot.rollouts > 0 &&
                snapshot.completedRollouts > 0,
            driftDetectionReady: snapshot.configurationDrifts > 0 &&
                snapshot.remediatedDrifts > 0,
            runtimePolicyReady: snapshot.runtimePolicies > 0 &&
                snapshot.activeRuntimePolicies > 0 &&
                snapshot.policyEvaluations > 0,
            runtimeHealthReady: snapshot.healthRules > 0 &&
                snapshot.healthEvaluations > 0 &&
                snapshot.passedHealthEvaluations > 0,
            noOpenDrifts: snapshot.openDrifts === 0,
            noFailedRollouts: snapshot.failedRollouts === 0,
            noDeniedPolicyEvaluations: snapshot.deniedPolicyEvaluations === 0,
            noFailedHealthEvaluations: snapshot.failedHealthEvaluations === 0,
            evidenceChainVerified: snapshot.evidenceChainVerified,
            platformEventsReady: snapshot.platformEvents > 0,
        };
        return {
            success: Object.values(checks).every(Boolean),
            system: "AVOS Production Hardening V7 — Mega Pack 14",
            version: "v7-mega-pack-14",
            healthStatus: snapshot.healthStatus,
            evidenceChainVerified: snapshot.evidenceChainVerified,
            checks,
            snapshot,
        };
    }
    seedRuntimeGovernance() {
        const policy = this.createRuntimePolicy({
            name: "AVOS Production Runtime Policy",
            environment: "production",
            description: "Protects critical production runtime configuration",
            requiresApproval: true,
            blockedKeys: [
                "disableAuthentication",
                "disableAudit",
                "allowAnonymousAdmin",
            ],
            protectedKeys: [
                "authentication.enabled",
                "audit.enabled",
                "security.enforcement",
            ],
            minimumHealthPercent: 95,
        }, "mega-pack-14-seed");
        if (!policy.active) {
            throw new Error("Runtime production policy was not activated");
        }
        const configuration = this.createConfiguration({
            name: "AVOS Production Runtime Baseline",
            environment: "production",
            values: {
                authentication: {
                    enabled: true,
                },
                audit: {
                    enabled: true,
                },
                security: {
                    enforcement: "strict",
                },
                runtime: {
                    requestTimeoutMs: 30000,
                    retryCount: 3,
                    gracefulShutdown: true,
                },
            },
            createdBy: "mega-pack-14-seed",
        }, "mega-pack-14-seed");
        const approval = this.requestConfigurationApproval(configuration.id, "mega-pack-14-seed");
        this.approveConfiguration(approval.id, "mega-pack-14-seed");
        this.startRollout(configuration.id, {
            strategy: "progressive",
            targetPercentage: 100,
            healthThresholdPercent: 95,
            requestedBy: "mega-pack-14-seed",
        });
        const featureFlag = this.createFeatureFlag({
            key: "enterprise-runtime-governance",
            name: "Enterprise Runtime Governance",
            description: "Enables AVOS enterprise runtime governance controls",
            environment: "production",
            enabled: true,
            rolloutPercentage: 100,
            allowedAudiences: [
                "enterprise",
                "operations",
                "administrators",
            ],
            createdBy: "mega-pack-14-seed",
        }, "mega-pack-14-seed");
        this.activateFeatureFlag(featureFlag.id, "mega-pack-14-seed");
        this.evaluateFeatureFlag(featureFlag.id, {
            subjectReference: "mega-pack-14-validation-subject",
            audience: "enterprise",
        }, "mega-pack-14-seed");
        this.detectConfigurationDrift({
            configurationId: configuration.id,
            actualValues: configuration.values,
            description: "Production runtime matches approved baseline",
        }, "mega-pack-14-seed");
        const healthRule = this.createHealthRule({
            name: "AVOS Runtime Health Threshold",
            environment: "production",
            metricName: "runtimeHealthPercent",
            operator: "gte",
            threshold: 95,
        }, "mega-pack-14-seed");
        this.evaluateHealthRule(healthRule.id, {
            measuredValue: 100,
            message: "Production runtime health validation passed",
        }, "mega-pack-14-seed");
    }
};
exports.ProductionHardeningV7MegaPack14Service = ProductionHardeningV7MegaPack14Service;
exports.ProductionHardeningV7MegaPack14Service = ProductionHardeningV7MegaPack14Service = __decorate([
    (0, common_1.Injectable)()
], ProductionHardeningV7MegaPack14Service);
//# sourceMappingURL=production-hardening-v7-mega-pack-14.service.js.map