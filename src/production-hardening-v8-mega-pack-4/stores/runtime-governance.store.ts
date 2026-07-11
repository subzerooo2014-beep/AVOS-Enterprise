import { Injectable } from "@nestjs/common";
import {
  CascadingFailureAnalysis,
  GovernanceApprovalMatrixRule,
  GovernanceAuditEntry,
  GovernanceChangeWindow,
  GovernanceImpactAnalysis,
  GovernanceMaintenanceMode,
  GovernancePolicySimulation,
  GovernanceRecommendation,
  GovernanceRequest,
  RuntimeDependencyEdge,
  RuntimeDependencyNode,
  RuntimeSloDefinition,
  RuntimeSloEvaluation,
  AutonomousRecoveryPlan,
  ServiceIsolationPlan,
  RuntimeCapacityPolicy,
  RuntimeCapacityEvaluation,
  RuntimeDecisionRecord,
  AutonomousApprovalSuggestion,
  RuntimeGuardrail,
  RuntimeGuardrailEvaluation,
  RuntimeRunbookDefinition,
  RuntimeRunbookExecution,
  RuntimeChangeExecution,
  RuntimeExecutionLock,
  RuntimeExecutionEvidence,
  GovernanceSchedule,
  GovernanceScheduleRun,
  GovernanceEscalation,
  GovernanceNotification,
  GovernanceTimelineEvent,
  GovernanceCheckpoint,
  GovernanceRetentionPolicy,
  GovernanceRetentionEvaluation,
  GovernanceArchive,
  GovernanceRestorePlan,
} from "../contracts";
import {
  GovernanceControlMode,
} from "../contracts";
import {
  cloneGovernanceJson,
} from "../utils";

@Injectable()
export class RuntimeGovernanceStore {
  private readonly changeWindows =
    new Map<string, GovernanceChangeWindow>();

  private readonly maintenanceModes =
    new Map<string, GovernanceMaintenanceMode>();

  private readonly governanceRequests =
    new Map<string, GovernanceRequest>();

  private readonly dependencyNodes =
    new Map<string, RuntimeDependencyNode>();

  private readonly dependencyEdges =
    new Map<string, RuntimeDependencyEdge>();

  private readonly cascadeAnalyses =
    new Map<string, CascadingFailureAnalysis>();

  private readonly sloDefinitions =
    new Map<string, RuntimeSloDefinition>();

  private readonly sloEvaluations =
    new Map<string, RuntimeSloEvaluation>();

  private readonly recommendations =
    new Map<string, GovernanceRecommendation>();

  private readonly simulations =
    new Map<string, GovernancePolicySimulation>();

  private readonly impactAnalyses =
    new Map<string, GovernanceImpactAnalysis>();

  private readonly approvalMatrixRules =
    new Map<string, GovernanceApprovalMatrixRule>();

  private readonly recoveryPlans =
    new Map<string, AutonomousRecoveryPlan>();

  private readonly isolationPlans =
    new Map<string, ServiceIsolationPlan>();

  private readonly capacityPolicies =
    new Map<string, RuntimeCapacityPolicy>();

  private readonly capacityEvaluations =
    new Map<string, RuntimeCapacityEvaluation>();

  private readonly decisionRecords =
    new Map<string, RuntimeDecisionRecord>();

  private readonly approvalSuggestions =
    new Map<string, AutonomousApprovalSuggestion>();

  private readonly guardrails =
    new Map<string, RuntimeGuardrail>();

  private readonly guardrailEvaluations =
    new Map<string, RuntimeGuardrailEvaluation>();

  private readonly runbookDefinitions =
    new Map<string, RuntimeRunbookDefinition>();

  private readonly runbookExecutions =
    new Map<string, RuntimeRunbookExecution>();

  private readonly changeExecutions =
    new Map<string, RuntimeChangeExecution>();

  private readonly executionLocks =
    new Map<string, RuntimeExecutionLock>();

  private readonly executionEvidence:
    RuntimeExecutionEvidence[] = [];

  private readonly governanceSchedules =
    new Map<string, GovernanceSchedule>();

  private readonly governanceScheduleRuns =
    new Map<string, GovernanceScheduleRun>();

  private readonly governanceEscalations =
    new Map<string, GovernanceEscalation>();

  private readonly governanceNotifications =
    new Map<string, GovernanceNotification>();

  private readonly governanceTimeline:
    GovernanceTimelineEvent[] = [];

  private readonly governanceCheckpoints =
    new Map<string, GovernanceCheckpoint>();

  private readonly governanceRetentionPolicies =
    new Map<string, GovernanceRetentionPolicy>();

  private readonly governanceRetentionEvaluations =
    new Map<string, GovernanceRetentionEvaluation>();

  private readonly governanceArchives =
    new Map<string, GovernanceArchive>();

  private readonly governanceRestorePlans =
    new Map<string, GovernanceRestorePlan>();

  private readonly auditEntries:
    GovernanceAuditEntry[] = [];

  private controlMode =
    GovernanceControlMode.ENFORCE;

  getControlMode(): GovernanceControlMode {
    return this.controlMode;
  }

  setControlMode(
    controlMode: GovernanceControlMode,
  ): void {
    this.controlMode = controlMode;
  }

  saveChangeWindow(
    item: GovernanceChangeWindow,
  ): GovernanceChangeWindow {
    const stored =
      cloneGovernanceJson(item);

    this.changeWindows.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getChangeWindow(
    id: string,
  ): GovernanceChangeWindow | undefined {
    const item =
      this.changeWindows.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listChangeWindows():
    GovernanceChangeWindow[] {
    return Array.from(
      this.changeWindows.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveMaintenanceMode(
    item: GovernanceMaintenanceMode,
  ): GovernanceMaintenanceMode {
    const stored =
      cloneGovernanceJson(item);

    this.maintenanceModes.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getMaintenanceMode(
    id: string,
  ): GovernanceMaintenanceMode | undefined {
    const item =
      this.maintenanceModes.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listMaintenanceModes():
    GovernanceMaintenanceMode[] {
    return Array.from(
      this.maintenanceModes.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveGovernanceRequest(
    item: GovernanceRequest,
  ): GovernanceRequest {
    const stored =
      cloneGovernanceJson(item);

    this.governanceRequests.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceRequest(
    id: string,
  ): GovernanceRequest | undefined {
    const item =
      this.governanceRequests.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceRequests():
    GovernanceRequest[] {
    return Array.from(
      this.governanceRequests.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveDependencyNode(
    item: RuntimeDependencyNode,
  ): RuntimeDependencyNode {
    const stored =
      cloneGovernanceJson(item);

    this.dependencyNodes.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getDependencyNode(
    id: string,
  ): RuntimeDependencyNode | undefined {
    const item =
      this.dependencyNodes.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listDependencyNodes():
    RuntimeDependencyNode[] {
    return Array.from(
      this.dependencyNodes.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name),
      );
  }

  saveDependencyEdge(
    item: RuntimeDependencyEdge,
  ): RuntimeDependencyEdge {
    const stored =
      cloneGovernanceJson(item);

    this.dependencyEdges.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getDependencyEdge(
    id: string,
  ): RuntimeDependencyEdge | undefined {
    const item =
      this.dependencyEdges.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listDependencyEdges():
    RuntimeDependencyEdge[] {
    return Array.from(
      this.dependencyEdges.values(),
    ).map((item) =>
      cloneGovernanceJson(item),
    );
  }

  saveCascadeAnalysis(
    item: CascadingFailureAnalysis,
  ): CascadingFailureAnalysis {
    const stored =
      cloneGovernanceJson(item);

    this.cascadeAnalyses.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getCascadeAnalysis(
    id: string,
  ): CascadingFailureAnalysis | undefined {
    const item =
      this.cascadeAnalyses.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listCascadeAnalyses():
    CascadingFailureAnalysis[] {
    return Array.from(
      this.cascadeAnalyses.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.analyzedAt.localeCompare(
          a.analyzedAt,
        ),
      );
  }

  saveSloDefinition(
    item: RuntimeSloDefinition,
  ): RuntimeSloDefinition {
    const stored =
      cloneGovernanceJson(item);

    this.sloDefinitions.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getSloDefinition(
    id: string,
  ): RuntimeSloDefinition | undefined {
    const item =
      this.sloDefinitions.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listSloDefinitions():
    RuntimeSloDefinition[] {
    return Array.from(
      this.sloDefinitions.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name),
      );
  }

  saveSloEvaluation(
    item: RuntimeSloEvaluation,
  ): RuntimeSloEvaluation {
    const stored =
      cloneGovernanceJson(item);

    this.sloEvaluations.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getSloEvaluation(
    id: string,
  ): RuntimeSloEvaluation | undefined {
    const item =
      this.sloEvaluations.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listSloEvaluations():
    RuntimeSloEvaluation[] {
    return Array.from(
      this.sloEvaluations.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.evaluatedAt.localeCompare(
          a.evaluatedAt,
        ),
      );
  }

  saveRecommendation(
    item: GovernanceRecommendation,
  ): GovernanceRecommendation {
    const stored =
      cloneGovernanceJson(item);

    this.recommendations.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  listRecommendations():
    GovernanceRecommendation[] {
    return Array.from(
      this.recommendations.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort(
        (a, b) =>
          b.priority - a.priority,
      );
  }

  saveSimulation(
    item: GovernancePolicySimulation,
  ): GovernancePolicySimulation {
    const stored =
      cloneGovernanceJson(item);

    this.simulations.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getSimulation(
    id: string,
  ): GovernancePolicySimulation | undefined {
    const item =
      this.simulations.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listSimulations():
    GovernancePolicySimulation[] {
    return Array.from(
      this.simulations.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.startedAt.localeCompare(
          a.startedAt,
        ),
      );
  }

  saveImpactAnalysis(
    item: GovernanceImpactAnalysis,
  ): GovernanceImpactAnalysis {
    const stored =
      cloneGovernanceJson(item);

    this.impactAnalyses.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getImpactAnalysis(
    id: string,
  ): GovernanceImpactAnalysis | undefined {
    const item =
      this.impactAnalyses.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listImpactAnalyses():
    GovernanceImpactAnalysis[] {
    return Array.from(
      this.impactAnalyses.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.analyzedAt.localeCompare(
          a.analyzedAt,
        ),
      );
  }

  saveApprovalMatrixRule(
    item: GovernanceApprovalMatrixRule,
  ): GovernanceApprovalMatrixRule {
    const stored =
      cloneGovernanceJson(item);

    this.approvalMatrixRules.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getApprovalMatrixRule(
    id: string,
  ): GovernanceApprovalMatrixRule | undefined {
    const item =
      this.approvalMatrixRules.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listApprovalMatrixRules():
    GovernanceApprovalMatrixRule[] {
    return Array.from(
      this.approvalMatrixRules.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.priority - a.priority,
      );
  }

  saveRecoveryPlan(
    item: AutonomousRecoveryPlan,
  ): AutonomousRecoveryPlan {
    const stored =
      cloneGovernanceJson(item);

    this.recoveryPlans.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getRecoveryPlan(
    id: string,
  ): AutonomousRecoveryPlan | undefined {
    const item =
      this.recoveryPlans.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listRecoveryPlans():
    AutonomousRecoveryPlan[] {
    return Array.from(
      this.recoveryPlans.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveIsolationPlan(
    item: ServiceIsolationPlan,
  ): ServiceIsolationPlan {
    const stored =
      cloneGovernanceJson(item);

    this.isolationPlans.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getIsolationPlan(
    id: string,
  ): ServiceIsolationPlan | undefined {
    const item =
      this.isolationPlans.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listIsolationPlans():
    ServiceIsolationPlan[] {
    return Array.from(
      this.isolationPlans.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveCapacityPolicy(
    item: RuntimeCapacityPolicy,
  ): RuntimeCapacityPolicy {
    const stored =
      cloneGovernanceJson(item);

    this.capacityPolicies.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getCapacityPolicy(
    id: string,
  ): RuntimeCapacityPolicy | undefined {
    const item =
      this.capacityPolicies.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listCapacityPolicies():
    RuntimeCapacityPolicy[] {
    return Array.from(
      this.capacityPolicies.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name),
      );
  }

  saveCapacityEvaluation(
    item: RuntimeCapacityEvaluation,
  ): RuntimeCapacityEvaluation {
    const stored =
      cloneGovernanceJson(item);

    this.capacityEvaluations.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getCapacityEvaluation(
    id: string,
  ): RuntimeCapacityEvaluation | undefined {
    const item =
      this.capacityEvaluations.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listCapacityEvaluations():
    RuntimeCapacityEvaluation[] {
    return Array.from(
      this.capacityEvaluations.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.evaluatedAt.localeCompare(
          a.evaluatedAt,
        ),
      );
  }
  saveDecisionRecord(
    item: RuntimeDecisionRecord,
  ): RuntimeDecisionRecord {
    const stored =
      cloneGovernanceJson(item);

    this.decisionRecords.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getDecisionRecord(
    id: string,
  ): RuntimeDecisionRecord | undefined {
    const item =
      this.decisionRecords.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listDecisionRecords():
    RuntimeDecisionRecord[] {
    return Array.from(
      this.decisionRecords.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveApprovalSuggestion(
    item: AutonomousApprovalSuggestion,
  ): AutonomousApprovalSuggestion {
    const stored =
      cloneGovernanceJson(item);

    this.approvalSuggestions.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getApprovalSuggestion(
    id: string,
  ): AutonomousApprovalSuggestion | undefined {
    const item =
      this.approvalSuggestions.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listApprovalSuggestions():
    AutonomousApprovalSuggestion[] {
    return Array.from(
      this.approvalSuggestions.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.generatedAt.localeCompare(
          a.generatedAt,
        ),
      );
  }

  saveGuardrail(
    item: RuntimeGuardrail,
  ): RuntimeGuardrail {
    const stored =
      cloneGovernanceJson(item);

    this.guardrails.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGuardrail(
    id: string,
  ): RuntimeGuardrail | undefined {
    const item =
      this.guardrails.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGuardrails():
    RuntimeGuardrail[] {
    return Array.from(
      this.guardrails.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.priority - a.priority,
      );
  }

  saveGuardrailEvaluation(
    item: RuntimeGuardrailEvaluation,
  ): RuntimeGuardrailEvaluation {
    const stored =
      cloneGovernanceJson(item);

    this.guardrailEvaluations.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGuardrailEvaluation(
    id: string,
  ): RuntimeGuardrailEvaluation | undefined {
    const item =
      this.guardrailEvaluations.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGuardrailEvaluations():
    RuntimeGuardrailEvaluation[] {
    return Array.from(
      this.guardrailEvaluations.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.evaluatedAt.localeCompare(
          a.evaluatedAt,
        ),
      );
  }
  saveRunbookDefinition(
    item: RuntimeRunbookDefinition,
  ): RuntimeRunbookDefinition {
    const stored =
      cloneGovernanceJson(item);

    this.runbookDefinitions.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getRunbookDefinition(
    id: string,
  ): RuntimeRunbookDefinition | undefined {
    const item =
      this.runbookDefinitions.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listRunbookDefinitions():
    RuntimeRunbookDefinition[] {
    return Array.from(
      this.runbookDefinitions.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  findRunbooksByKey(
    key: string,
  ): RuntimeRunbookDefinition[] {
    return this.listRunbookDefinitions()
      .filter(
        (item) =>
          item.key === key,
      )
      .sort(
        (a, b) =>
          b.version - a.version,
      );
  }

  saveRunbookExecution(
    item: RuntimeRunbookExecution,
  ): RuntimeRunbookExecution {
    const stored =
      cloneGovernanceJson(item);

    this.runbookExecutions.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getRunbookExecution(
    id: string,
  ): RuntimeRunbookExecution | undefined {
    const item =
      this.runbookExecutions.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listRunbookExecutions():
    RuntimeRunbookExecution[] {
    return Array.from(
      this.runbookExecutions.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.startedAt.localeCompare(
          a.startedAt,
        ),
      );
  }

  saveChangeExecution(
    item: RuntimeChangeExecution,
  ): RuntimeChangeExecution {
    const stored =
      cloneGovernanceJson(item);

    this.changeExecutions.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getChangeExecution(
    id: string,
  ): RuntimeChangeExecution | undefined {
    const item =
      this.changeExecutions.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listChangeExecutions():
    RuntimeChangeExecution[] {
    return Array.from(
      this.changeExecutions.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveExecutionLock(
    item: RuntimeExecutionLock,
  ): RuntimeExecutionLock {
    const stored =
      cloneGovernanceJson(item);

    this.executionLocks.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getExecutionLock(
    id: string,
  ): RuntimeExecutionLock | undefined {
    const item =
      this.executionLocks.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listExecutionLocks():
    RuntimeExecutionLock[] {
    return Array.from(
      this.executionLocks.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.acquiredAt.localeCompare(
          a.acquiredAt,
        ),
      );
  }

  appendExecutionEvidence(
    item: RuntimeExecutionEvidence,
  ): RuntimeExecutionEvidence {
    const stored =
      cloneGovernanceJson(item);

    this.executionEvidence.push(
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  listExecutionEvidence():
    RuntimeExecutionEvidence[] {
    return this.executionEvidence
      .map((item) =>
        cloneGovernanceJson(item),
      );
  }

  getLatestExecutionEvidence():
    RuntimeExecutionEvidence | undefined {
    if (
      this.executionEvidence.length === 0
    ) {
      return undefined;
    }

    return cloneGovernanceJson(
      this.executionEvidence[
        this.executionEvidence.length - 1
      ],
    );
  }
  saveGovernanceSchedule(
    item: GovernanceSchedule,
  ): GovernanceSchedule {
    const stored =
      cloneGovernanceJson(item);

    this.governanceSchedules.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceSchedule(
    id: string,
  ): GovernanceSchedule | undefined {
    const item =
      this.governanceSchedules.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceSchedules():
    GovernanceSchedule[] {
    return Array.from(
      this.governanceSchedules.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveGovernanceScheduleRun(
    item: GovernanceScheduleRun,
  ): GovernanceScheduleRun {
    const stored =
      cloneGovernanceJson(item);

    this.governanceScheduleRuns.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceScheduleRun(
    id: string,
  ): GovernanceScheduleRun | undefined {
    const item =
      this.governanceScheduleRuns.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceScheduleRuns():
    GovernanceScheduleRun[] {
    return Array.from(
      this.governanceScheduleRuns.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.startedAt.localeCompare(
          a.startedAt,
        ),
      );
  }

  saveGovernanceEscalation(
    item: GovernanceEscalation,
  ): GovernanceEscalation {
    const stored =
      cloneGovernanceJson(item);

    this.governanceEscalations.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceEscalation(
    id: string,
  ): GovernanceEscalation | undefined {
    const item =
      this.governanceEscalations.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceEscalations():
    GovernanceEscalation[] {
    return Array.from(
      this.governanceEscalations.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveGovernanceNotification(
    item: GovernanceNotification,
  ): GovernanceNotification {
    const stored =
      cloneGovernanceJson(item);

    this.governanceNotifications.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceNotification(
    id: string,
  ): GovernanceNotification | undefined {
    const item =
      this.governanceNotifications.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceNotifications():
    GovernanceNotification[] {
    return Array.from(
      this.governanceNotifications.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  appendGovernanceTimelineEvent(
    item: GovernanceTimelineEvent,
  ): GovernanceTimelineEvent {
    const stored =
      cloneGovernanceJson(item);

    this.governanceTimeline.push(
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  listGovernanceTimeline():
    GovernanceTimelineEvent[] {
    return this.governanceTimeline
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort(
        (a, b) =>
          a.sequence - b.sequence,
      );
  }
  saveGovernanceCheckpoint(
    item: GovernanceCheckpoint,
  ): GovernanceCheckpoint {
    const stored =
      cloneGovernanceJson(item);

    this.governanceCheckpoints.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceCheckpoint(
    id: string,
  ): GovernanceCheckpoint | undefined {
    const item =
      this.governanceCheckpoints.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceCheckpoints():
    GovernanceCheckpoint[] {
    return Array.from(
      this.governanceCheckpoints.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveGovernanceRetentionPolicy(
    item: GovernanceRetentionPolicy,
  ): GovernanceRetentionPolicy {
    const stored =
      cloneGovernanceJson(item);

    this.governanceRetentionPolicies.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceRetentionPolicy(
    id: string,
  ): GovernanceRetentionPolicy | undefined {
    const item =
      this.governanceRetentionPolicies.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceRetentionPolicies():
    GovernanceRetentionPolicy[] {
    return Array.from(
      this.governanceRetentionPolicies.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveGovernanceRetentionEvaluation(
    item: GovernanceRetentionEvaluation,
  ): GovernanceRetentionEvaluation {
    const stored =
      cloneGovernanceJson(item);

    this.governanceRetentionEvaluations.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  listGovernanceRetentionEvaluations():
    GovernanceRetentionEvaluation[] {
    return Array.from(
      this.governanceRetentionEvaluations.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.evaluatedAt.localeCompare(
          a.evaluatedAt,
        ),
      );
  }

  saveGovernanceArchive(
    item: GovernanceArchive,
  ): GovernanceArchive {
    const stored =
      cloneGovernanceJson(item);

    this.governanceArchives.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceArchive(
    id: string,
  ): GovernanceArchive | undefined {
    const item =
      this.governanceArchives.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceArchives():
    GovernanceArchive[] {
    return Array.from(
      this.governanceArchives.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }

  saveGovernanceRestorePlan(
    item: GovernanceRestorePlan,
  ): GovernanceRestorePlan {
    const stored =
      cloneGovernanceJson(item);

    this.governanceRestorePlans.set(
      stored.id,
      stored,
    );

    return cloneGovernanceJson(stored);
  }

  getGovernanceRestorePlan(
    id: string,
  ): GovernanceRestorePlan | undefined {
    const item =
      this.governanceRestorePlans.get(id);

    return item
      ? cloneGovernanceJson(item)
      : undefined;
  }

  listGovernanceRestorePlans():
    GovernanceRestorePlan[] {
    return Array.from(
      this.governanceRestorePlans.values(),
    )
      .map((item) =>
        cloneGovernanceJson(item),
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
      );
  }
  appendAuditEntry(
    item: GovernanceAuditEntry,
  ): GovernanceAuditEntry {
    const stored =
      cloneGovernanceJson(item);

    this.auditEntries.push(stored);

    return cloneGovernanceJson(stored);
  }

  listAuditEntries():
    GovernanceAuditEntry[] {
    return this.auditEntries.map(
      (item) =>
        cloneGovernanceJson(item),
    );
  }

  getLatestAuditEntry():
    GovernanceAuditEntry | undefined {
    const length =
      this.auditEntries.length;

    if (length === 0) {
      return undefined;
    }

    return cloneGovernanceJson(
      this.auditEntries[length - 1],
    );
  }

  clear(): void {
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
    this.executionEvidence.splice(
      0,
      this.executionEvidence.length,
    );
    this.governanceSchedules.clear();
    this.governanceScheduleRuns.clear();
    this.governanceEscalations.clear();
    this.governanceNotifications.clear();
    this.governanceTimeline.splice(
      0,
      this.governanceTimeline.length,
    );
    this.governanceCheckpoints.clear();
    this.governanceRetentionPolicies.clear();
    this.governanceRetentionEvaluations.clear();
    this.governanceArchives.clear();
    this.governanceRestorePlans.clear();
    this.auditEntries.splice(
      0,
      this.auditEntries.length,
    );

    this.controlMode =
      GovernanceControlMode.ENFORCE;
  }
}





