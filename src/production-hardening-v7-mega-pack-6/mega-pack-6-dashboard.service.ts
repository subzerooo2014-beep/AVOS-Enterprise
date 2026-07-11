import { Injectable } from "@nestjs/common";
import {
  MEGA_PACK_6_COLLECTIONS,
  MEGA_PACK_6_SYSTEM,
} from "./constants/mega-pack-6.constants";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { AutomatedRemediationService } from "./automated-remediation.service";
import { ComplianceBaselineService } from "./compliance-baseline.service";
import { ControlSchedulerService } from "./control-scheduler.service";
import { EvidenceChainService } from "./evidence-chain.service";
import { IncidentCommandService } from "./incident-command.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { RiskTreatmentService } from "./risk-treatment.service";
import { WorkflowExecutionService } from "./workflow-execution.service";
import {
  SchedulerRun,
} from "./automation.types";

@Injectable()
export class MegaPack6DashboardService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly baselines:
      ComplianceBaselineService,
    private readonly approvals:
      ApprovalWorkflowService,
    private readonly incidents:
      IncidentCommandService,
    private readonly treatments:
      RiskTreatmentService,
    private readonly workflows:
      WorkflowExecutionService,
    private readonly remediations:
      AutomatedRemediationService,
    private readonly evidence:
      EvidenceChainService,
    private readonly scheduler:
      ControlSchedulerService,
    private readonly events:
      PlatformEventBusService,
  ) {}

  async status(): Promise<Record<string, unknown>> {
    const [
      baselines,
      comparisons,
      approvals,
      incidentSummary,
      treatmentSummary,
      workflowDefinitions,
      workflowExecutions,
      remediations,
      evidenceEntries,
      evidenceVerification,
      schedules,
      schedulerRuns,
      platformEvents,
      pendingEvents,
    ] = await Promise.all([
      this.baselines.list(),
      this.baselines.listComparisons(),
      this.approvals.list(),
      this.incidents.summary(),
      this.treatments.summary(),
      this.workflows.listDefinitions(),
      this.workflows.listExecutions(),
      this.remediations.list(),
      this.evidence.list(),
      this.evidence.verify(),
      this.scheduler.list(),
      this.storage.readCollection<SchedulerRun>(
        MEGA_PACK_6_COLLECTIONS.schedulerRuns,
      ),
      this.events.list(),
      this.events.pendingCount(),
    ]);

    const activeBaselines =
      baselines.filter(
        (baseline) =>
          baseline.status === "active",
      ).length;

    const driftComparisons =
      comparisons.filter(
        (comparison) =>
          comparison.status ===
          "drift_detected",
      ).length;

    const pendingApprovals =
      approvals.filter(
        (approval) =>
          approval.decision === "pending",
      ).length;

    const openRemediations =
      remediations.filter(
        (remediation) =>
          ![
            "completed",
            "cancelled",
          ].includes(
            remediation.status,
          ),
      ).length;

    const failedWorkflows =
      workflowExecutions.filter(
        (execution) =>
          execution.status === "failed",
      ).length;

    const failedSchedulerRuns =
      schedulerRuns.filter(
        (run) =>
          run.status === "failed",
      ).length;

    return {
      success: true,
      system: MEGA_PACK_6_SYSTEM.name,
      version:
        MEGA_PACK_6_SYSTEM.version,
      module:
        MEGA_PACK_6_SYSTEM.module,
      timestamp:
        new Date().toISOString(),
      capabilities: {
        complianceBaselineEngine: true,
        baselineDriftDetection: true,
        approvalWorkflowEngine: true,
        incidentCommandSystem: true,
        riskTreatmentWorkflows: true,
        workflowExecutionEngine: true,
        automatedRemediation: true,
        evidenceChainAutomation: true,
        controlScheduler: true,
        platformEventBus: true,
        persistentStorage: true,
      },
      health: {
        status:
          evidenceVerification.verified &&
          failedWorkflows === 0 &&
          failedSchedulerRuns === 0
            ? "healthy"
            : "warning",
        evidenceChainVerified:
          evidenceVerification.verified,
        pendingPlatformEvents:
          pendingEvents,
        failedWorkflows,
        failedSchedulerRuns,
      },
      metrics: {
        baselines:
          baselines.length,
        activeBaselines,
        baselineComparisons:
          comparisons.length,
        driftComparisons,
        approvals:
          approvals.length,
        pendingApprovals,
        incidents:
          incidentSummary,
        riskTreatments:
          treatmentSummary,
        workflowDefinitions:
          workflowDefinitions.length,
        workflowExecutions:
          workflowExecutions.length,
        automatedRemediations:
          remediations.length,
        openRemediations,
        evidenceEntries:
          evidenceEntries.length,
        evidenceVerification,
        schedules:
          schedules.length,
        schedulerRuns:
          schedulerRuns.length,
        platformEvents:
          platformEvents.length,
      },
    };
  }
}
