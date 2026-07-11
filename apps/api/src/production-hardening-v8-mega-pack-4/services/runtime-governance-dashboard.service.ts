import { Injectable } from "@nestjs/common";
import {
  CascadingFailureRisk,
  ChangeWindowStatus,
  ChangeWindowType,
  DependencyHealthStatus,
  GovernanceDashboardSnapshot,
  GovernanceRequestStatus,
  GovernanceSimulationStatus,
  MaintenanceModeStatus,
  SloComplianceStatus,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeGovernanceDashboardService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  snapshot():
    GovernanceDashboardSnapshot {
    const requests =
      this.store
        .listGovernanceRequests();

    const windows =
      this.store
        .listChangeWindows();

    const maintenance =
      this.store
        .listMaintenanceModes();

    const nodes =
      this.store
        .listDependencyNodes();

    const edges =
      this.store
        .listDependencyEdges();

    const sloDefinitions =
      this.store
        .listSloDefinitions();

    const sloEvaluations =
      this.store
        .listSloEvaluations();

    const cascades =
      this.store
        .listCascadeAnalyses();

    const simulations =
      this.store
        .listSimulations();

    const integrity =
      this.audit.verify();

    const unhealthyDependencies =
      nodes.filter(
        (node) =>
          node.healthStatus ===
            DependencyHealthStatus.UNHEALTHY ||
          node.healthStatus ===
            DependencyHealthStatus.UNAVAILABLE,
      ).length;

    const breachedSlos =
      sloEvaluations.filter(
        (item) =>
          item.complianceStatus ===
          SloComplianceStatus.BREACHED,
      ).length;

    const healthStatus =
      !integrity.valid ||
      unhealthyDependencies > 0 ||
      breachedSlos > 0
        ? "unhealthy"
        : requests.some(
              (request) =>
                request.status ===
                  GovernanceRequestStatus.EVALUATING ||
                request.status ===
                  GovernanceRequestStatus.DEFERRED,
            ) ||
            nodes.some(
              (node) =>
                node.healthStatus ===
                DependencyHealthStatus.DEGRADED,
            )
          ? "degraded"
          : "healthy";

    return {
      system:
        "AVOS Production Hardening V8 — Mega Pack 4",
      version:
        "v8-mega-pack-4",
      healthStatus,
      controlMode:
        this.store.getControlMode(),
      evidenceChainVerified:
        integrity.valid,

      requests: {
        total:
          requests.length,
        pending:
          requests.filter(
            (item) =>
              item.status ===
              GovernanceRequestStatus.PENDING,
          ).length,
        evaluating:
          requests.filter(
            (item) =>
              item.status ===
              GovernanceRequestStatus.EVALUATING,
          ).length,
        approved:
          requests.filter(
            (item) =>
              item.status ===
              GovernanceRequestStatus.APPROVED,
          ).length,
        rejected:
          requests.filter(
            (item) =>
              item.status ===
              GovernanceRequestStatus.REJECTED,
          ).length,
        deferred:
          requests.filter(
            (item) =>
              item.status ===
              GovernanceRequestStatus.DEFERRED,
          ).length,
        executed:
          requests.filter(
            (item) =>
              item.status ===
              GovernanceRequestStatus.EXECUTED,
          ).length,
        failed:
          requests.filter(
            (item) =>
              item.status ===
              GovernanceRequestStatus.FAILED,
          ).length,
      },

      changeWindows: {
        total:
          windows.length,
        open:
          windows.filter(
            (item) =>
              item.status ===
              ChangeWindowStatus.OPEN,
          ).length,
        scheduled:
          windows.filter(
            (item) =>
              item.status ===
              ChangeWindowStatus.SCHEDULED,
          ).length,
        freeze:
          windows.filter(
            (item) =>
              item.type ===
              ChangeWindowType.FREEZE,
          ).length,
        emergency:
          windows.filter(
            (item) =>
              item.type ===
              ChangeWindowType.EMERGENCY,
          ).length,
      },

      maintenance: {
        total:
          maintenance.length,
        active:
          maintenance.filter(
            (item) =>
              item.status ===
              MaintenanceModeStatus.ACTIVE,
          ).length,
        scheduled:
          maintenance.filter(
            (item) =>
              item.status ===
              MaintenanceModeStatus.SCHEDULED,
          ).length,
      },

      dependencies: {
        nodes:
          nodes.length,
        edges:
          edges.length,
        healthy:
          nodes.filter(
            (node) =>
              node.healthStatus ===
              DependencyHealthStatus.HEALTHY,
          ).length,
        degraded:
          nodes.filter(
            (node) =>
              node.healthStatus ===
              DependencyHealthStatus.DEGRADED,
          ).length,
        unhealthy:
          nodes.filter(
            (node) =>
              node.healthStatus ===
              DependencyHealthStatus.UNHEALTHY,
          ).length,
        unavailable:
          nodes.filter(
            (node) =>
              node.healthStatus ===
              DependencyHealthStatus.UNAVAILABLE,
          ).length,
        unknown:
          nodes.filter(
            (node) =>
              node.healthStatus ===
              DependencyHealthStatus.UNKNOWN,
          ).length,
      },

      slo: {
        definitions:
          sloDefinitions.length,
        enabledDefinitions:
          sloDefinitions.filter(
            (item) =>
              item.enabled,
          ).length,
        evaluations:
          sloEvaluations.length,
        compliant:
          sloEvaluations.filter(
            (item) =>
              item.complianceStatus ===
              SloComplianceStatus.COMPLIANT,
          ).length,
        atRisk:
          sloEvaluations.filter(
            (item) =>
              item.complianceStatus ===
              SloComplianceStatus.AT_RISK,
          ).length,
        breached:
          sloEvaluations.filter(
            (item) =>
              item.complianceStatus ===
              SloComplianceStatus.BREACHED,
          ).length,
        unknown:
          sloEvaluations.filter(
            (item) =>
              item.complianceStatus ===
              SloComplianceStatus.UNKNOWN,
          ).length,
      },

      cascade: {
        analyses:
          cascades.length,
        critical:
          cascades.filter(
            (item) =>
              item.risk ===
              CascadingFailureRisk.CRITICAL,
          ).length,
        high:
          cascades.filter(
            (item) =>
              item.risk ===
              CascadingFailureRisk.HIGH,
          ).length,
        medium:
          cascades.filter(
            (item) =>
              item.risk ===
              CascadingFailureRisk.MEDIUM,
          ).length,
        low:
          cascades.filter(
            (item) =>
              item.risk ===
              CascadingFailureRisk.LOW,
          ).length,
        none:
          cascades.filter(
            (item) =>
              item.risk ===
              CascadingFailureRisk.NONE,
          ).length,
      },

      simulations: {
        total:
          simulations.length,
        completed:
          simulations.filter(
            (item) =>
              item.status ===
              GovernanceSimulationStatus.COMPLETED,
          ).length,
        failed:
          simulations.filter(
            (item) =>
              item.status ===
              GovernanceSimulationStatus.FAILED,
          ).length,
      },

      impactAnalyses:
        this.store
          .listImpactAnalyses()
          .length,

      approvalMatrixRules:
        this.store
          .listApprovalMatrixRules()
          .length,

      recommendations:
        this.store
          .listRecommendations()
          .length,

      auditEntries:
        this.store
          .listAuditEntries()
          .length,

      generatedAt:
        new Date().toISOString(),
    };
  }
}
