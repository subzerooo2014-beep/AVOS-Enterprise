"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeGovernanceStore = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const utils_1 = require("../utils");
let RuntimeGovernanceStore = class RuntimeGovernanceStore {
    constructor() {
        this.changeWindows = new Map();
        this.maintenanceModes = new Map();
        this.governanceRequests = new Map();
        this.dependencyNodes = new Map();
        this.dependencyEdges = new Map();
        this.cascadeAnalyses = new Map();
        this.sloDefinitions = new Map();
        this.sloEvaluations = new Map();
        this.recommendations = new Map();
        this.simulations = new Map();
        this.impactAnalyses = new Map();
        this.approvalMatrixRules = new Map();
        this.recoveryPlans = new Map();
        this.isolationPlans = new Map();
        this.capacityPolicies = new Map();
        this.capacityEvaluations = new Map();
        this.decisionRecords = new Map();
        this.approvalSuggestions = new Map();
        this.guardrails = new Map();
        this.guardrailEvaluations = new Map();
        this.runbookDefinitions = new Map();
        this.runbookExecutions = new Map();
        this.changeExecutions = new Map();
        this.executionLocks = new Map();
        this.executionEvidence = [];
        this.governanceSchedules = new Map();
        this.governanceScheduleRuns = new Map();
        this.governanceEscalations = new Map();
        this.governanceNotifications = new Map();
        this.governanceTimeline = [];
        this.governanceCheckpoints = new Map();
        this.governanceRetentionPolicies = new Map();
        this.governanceRetentionEvaluations = new Map();
        this.governanceArchives = new Map();
        this.governanceRestorePlans = new Map();
        this.auditEntries = [];
        this.controlMode = contracts_1.GovernanceControlMode.ENFORCE;
    }
    getControlMode() {
        return this.controlMode;
    }
    setControlMode(controlMode) {
        this.controlMode = controlMode;
    }
    saveChangeWindow(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.changeWindows.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getChangeWindow(id) {
        const item = this.changeWindows.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listChangeWindows() {
        return Array.from(this.changeWindows.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveMaintenanceMode(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.maintenanceModes.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getMaintenanceMode(id) {
        const item = this.maintenanceModes.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listMaintenanceModes() {
        return Array.from(this.maintenanceModes.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveGovernanceRequest(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceRequests.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceRequest(id) {
        const item = this.governanceRequests.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceRequests() {
        return Array.from(this.governanceRequests.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveDependencyNode(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.dependencyNodes.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getDependencyNode(id) {
        const item = this.dependencyNodes.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listDependencyNodes() {
        return Array.from(this.dependencyNodes.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    saveDependencyEdge(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.dependencyEdges.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getDependencyEdge(id) {
        const item = this.dependencyEdges.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listDependencyEdges() {
        return Array.from(this.dependencyEdges.values()).map((item) => (0, utils_1.cloneGovernanceJson)(item));
    }
    saveCascadeAnalysis(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.cascadeAnalyses.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getCascadeAnalysis(id) {
        const item = this.cascadeAnalyses.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listCascadeAnalyses() {
        return Array.from(this.cascadeAnalyses.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.analyzedAt.localeCompare(a.analyzedAt));
    }
    saveSloDefinition(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.sloDefinitions.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getSloDefinition(id) {
        const item = this.sloDefinitions.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listSloDefinitions() {
        return Array.from(this.sloDefinitions.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    saveSloEvaluation(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.sloEvaluations.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getSloEvaluation(id) {
        const item = this.sloEvaluations.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listSloEvaluations() {
        return Array.from(this.sloEvaluations.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    saveRecommendation(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.recommendations.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    listRecommendations() {
        return Array.from(this.recommendations.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.priority - a.priority);
    }
    saveSimulation(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.simulations.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getSimulation(id) {
        const item = this.simulations.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listSimulations() {
        return Array.from(this.simulations.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    }
    saveImpactAnalysis(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.impactAnalyses.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getImpactAnalysis(id) {
        const item = this.impactAnalyses.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listImpactAnalyses() {
        return Array.from(this.impactAnalyses.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.analyzedAt.localeCompare(a.analyzedAt));
    }
    saveApprovalMatrixRule(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.approvalMatrixRules.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getApprovalMatrixRule(id) {
        const item = this.approvalMatrixRules.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listApprovalMatrixRules() {
        return Array.from(this.approvalMatrixRules.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.priority - a.priority);
    }
    saveRecoveryPlan(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.recoveryPlans.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getRecoveryPlan(id) {
        const item = this.recoveryPlans.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listRecoveryPlans() {
        return Array.from(this.recoveryPlans.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveIsolationPlan(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.isolationPlans.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getIsolationPlan(id) {
        const item = this.isolationPlans.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listIsolationPlans() {
        return Array.from(this.isolationPlans.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveCapacityPolicy(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.capacityPolicies.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getCapacityPolicy(id) {
        const item = this.capacityPolicies.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listCapacityPolicies() {
        return Array.from(this.capacityPolicies.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    saveCapacityEvaluation(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.capacityEvaluations.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getCapacityEvaluation(id) {
        const item = this.capacityEvaluations.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listCapacityEvaluations() {
        return Array.from(this.capacityEvaluations.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    saveDecisionRecord(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.decisionRecords.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getDecisionRecord(id) {
        const item = this.decisionRecords.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listDecisionRecords() {
        return Array.from(this.decisionRecords.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveApprovalSuggestion(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.approvalSuggestions.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getApprovalSuggestion(id) {
        const item = this.approvalSuggestions.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listApprovalSuggestions() {
        return Array.from(this.approvalSuggestions.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
    }
    saveGuardrail(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.guardrails.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGuardrail(id) {
        const item = this.guardrails.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGuardrails() {
        return Array.from(this.guardrails.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.priority - a.priority);
    }
    saveGuardrailEvaluation(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.guardrailEvaluations.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGuardrailEvaluation(id) {
        const item = this.guardrailEvaluations.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGuardrailEvaluations() {
        return Array.from(this.guardrailEvaluations.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    saveRunbookDefinition(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.runbookDefinitions.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getRunbookDefinition(id) {
        const item = this.runbookDefinitions.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listRunbookDefinitions() {
        return Array.from(this.runbookDefinitions.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    findRunbooksByKey(key) {
        return this.listRunbookDefinitions()
            .filter((item) => item.key === key)
            .sort((a, b) => b.version - a.version);
    }
    saveRunbookExecution(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.runbookExecutions.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getRunbookExecution(id) {
        const item = this.runbookExecutions.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listRunbookExecutions() {
        return Array.from(this.runbookExecutions.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    }
    saveChangeExecution(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.changeExecutions.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getChangeExecution(id) {
        const item = this.changeExecutions.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listChangeExecutions() {
        return Array.from(this.changeExecutions.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveExecutionLock(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.executionLocks.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getExecutionLock(id) {
        const item = this.executionLocks.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listExecutionLocks() {
        return Array.from(this.executionLocks.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.acquiredAt.localeCompare(a.acquiredAt));
    }
    appendExecutionEvidence(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.executionEvidence.push(stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    listExecutionEvidence() {
        return this.executionEvidence
            .map((item) => (0, utils_1.cloneGovernanceJson)(item));
    }
    getLatestExecutionEvidence() {
        if (this.executionEvidence.length === 0) {
            return undefined;
        }
        return (0, utils_1.cloneGovernanceJson)(this.executionEvidence[this.executionEvidence.length - 1]);
    }
    saveGovernanceSchedule(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceSchedules.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceSchedule(id) {
        const item = this.governanceSchedules.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceSchedules() {
        return Array.from(this.governanceSchedules.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveGovernanceScheduleRun(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceScheduleRuns.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceScheduleRun(id) {
        const item = this.governanceScheduleRuns.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceScheduleRuns() {
        return Array.from(this.governanceScheduleRuns.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    }
    saveGovernanceEscalation(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceEscalations.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceEscalation(id) {
        const item = this.governanceEscalations.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceEscalations() {
        return Array.from(this.governanceEscalations.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveGovernanceNotification(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceNotifications.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceNotification(id) {
        const item = this.governanceNotifications.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceNotifications() {
        return Array.from(this.governanceNotifications.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    appendGovernanceTimelineEvent(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceTimeline.push(stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    listGovernanceTimeline() {
        return this.governanceTimeline
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => a.sequence - b.sequence);
    }
    saveGovernanceCheckpoint(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceCheckpoints.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceCheckpoint(id) {
        const item = this.governanceCheckpoints.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceCheckpoints() {
        return Array.from(this.governanceCheckpoints.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveGovernanceRetentionPolicy(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceRetentionPolicies.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceRetentionPolicy(id) {
        const item = this.governanceRetentionPolicies.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceRetentionPolicies() {
        return Array.from(this.governanceRetentionPolicies.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveGovernanceRetentionEvaluation(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceRetentionEvaluations.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    listGovernanceRetentionEvaluations() {
        return Array.from(this.governanceRetentionEvaluations.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    saveGovernanceArchive(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceArchives.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceArchive(id) {
        const item = this.governanceArchives.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceArchives() {
        return Array.from(this.governanceArchives.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveGovernanceRestorePlan(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.governanceRestorePlans.set(stored.id, stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    getGovernanceRestorePlan(id) {
        const item = this.governanceRestorePlans.get(id);
        return item
            ? (0, utils_1.cloneGovernanceJson)(item)
            : undefined;
    }
    listGovernanceRestorePlans() {
        return Array.from(this.governanceRestorePlans.values())
            .map((item) => (0, utils_1.cloneGovernanceJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    appendAuditEntry(item) {
        const stored = (0, utils_1.cloneGovernanceJson)(item);
        this.auditEntries.push(stored);
        return (0, utils_1.cloneGovernanceJson)(stored);
    }
    listAuditEntries() {
        return this.auditEntries.map((item) => (0, utils_1.cloneGovernanceJson)(item));
    }
    getLatestAuditEntry() {
        const length = this.auditEntries.length;
        if (length === 0) {
            return undefined;
        }
        return (0, utils_1.cloneGovernanceJson)(this.auditEntries[length - 1]);
    }
    clear() {
        this.changeWindows.clear();
        this.maintenanceModes.clear();
        this.governanceRequests.clear();
        this.dependencyNodes.clear();
        this.dependencyEdges.clear();
        this.cascadeAnalyses.clear();
        this.sloDefinitions.clear();
        this.sloEvaluations.clear();
        this.recommendations.clear();
        this.simulations.clear();
        this.impactAnalyses.clear();
        this.approvalMatrixRules.clear();
        this.recoveryPlans.clear();
        this.isolationPlans.clear();
        this.capacityPolicies.clear();
        this.capacityEvaluations.clear();
        this.decisionRecords.clear();
        this.approvalSuggestions.clear();
        this.guardrails.clear();
        this.guardrailEvaluations.clear();
        this.runbookDefinitions.clear();
        this.runbookExecutions.clear();
        this.changeExecutions.clear();
        this.executionLocks.clear();
        this.executionEvidence.splice(0, this.executionEvidence.length);
        this.governanceSchedules.clear();
        this.governanceScheduleRuns.clear();
        this.governanceEscalations.clear();
        this.governanceNotifications.clear();
        this.governanceTimeline.splice(0, this.governanceTimeline.length);
        this.governanceCheckpoints.clear();
        this.governanceRetentionPolicies.clear();
        this.governanceRetentionEvaluations.clear();
        this.governanceArchives.clear();
        this.governanceRestorePlans.clear();
        this.auditEntries.splice(0, this.auditEntries.length);
        this.controlMode =
            contracts_1.GovernanceControlMode.ENFORCE;
    }
};
exports.RuntimeGovernanceStore = RuntimeGovernanceStore;
exports.RuntimeGovernanceStore = RuntimeGovernanceStore = __decorate([
    (0, common_1.Injectable)()
], RuntimeGovernanceStore);
//# sourceMappingURL=runtime-governance.store.js.map