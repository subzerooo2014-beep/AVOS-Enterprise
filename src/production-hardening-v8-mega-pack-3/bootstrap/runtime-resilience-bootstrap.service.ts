import {
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import {
  ApprovalDecision,
  ResilienceActionType,
  RuntimeChangeType,
  RuntimeControlMode,
  RuntimeDecision,
  RuntimeEnvironment,
  RuntimeRiskLevel,
  RuntimeSignalStatus,
  RuntimeSignalType,
} from "../contracts/runtime-resilience.enums";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { ResilienceConfigurationService } from "../services/resilience-configuration.service";
import { ResiliencePolicyService } from "../services/resilience-policy.service";
import { RuntimeRiskEvaluationService } from "../services/runtime-risk-evaluation.service";
import { RuntimeSignalService } from "../services/runtime-signal.service";
import { RuntimeBaselineService } from "../services/runtime-baseline.service";

@Injectable()
export class RuntimeResilienceBootstrapService
  implements OnModuleInit
{
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly configurations:
      ResilienceConfigurationService,
    private readonly policies:
      ResiliencePolicyService,
    private readonly risk:
      RuntimeRiskEvaluationService,
    private readonly signals:
      RuntimeSignalService,
    private readonly baselines:
      RuntimeBaselineService,
  ) {}

  onModuleInit(): void {
    this.bootstrap();
  }

  bootstrap(): void {
    if (
      this.store.listConfigurations().length > 0 ||
      this.store.listPolicies().length > 0
    ) {
      return;
    }

    const systemActor = {
      id: "avos-v8-bootstrap",
      type: "system" as const,
      name: "AVOS V8 Runtime Bootstrap",
      roles: [
        "runtime_admin",
        "resilience_operator",
      ],
    };

    const configuration =
      this.configurations.create({
        key: "avos.runtime.resilience",
        name: "AVOS Runtime Resilience Configuration",
        description:
          "Default production runtime resilience configuration",
        environment: RuntimeEnvironment.PRODUCTION,
        namespace: "avos-core",
        controlMode: RuntimeControlMode.ENFORCE,
        changeType: RuntimeChangeType.CONFIGURATION,
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

    this.configurations.submit(
      configuration.id,
      {
        reason:
          "Initial AVOS V8 Mega Pack 3 bootstrap",
        context: {
          source: "module_bootstrap",
        },
        actor: systemActor,
      },
    );

    this.configurations.approve(
      configuration.id,
      {
        decision: ApprovalDecision.APPROVED,
        reason:
          "Bootstrap security approval",
        actor: {
          id: "avos-security-approver",
          type: "system",
          name: "AVOS Security Approver",
          roles: ["security_approver"],
        },
      },
    );

    const approvedConfiguration =
      this.configurations.approve(
        configuration.id,
        {
          decision: ApprovalDecision.APPROVED,
          reason:
            "Bootstrap operations approval",
          actor: {
            id: "avos-operations-approver",
            type: "system",
            name: "AVOS Operations Approver",
            roles: ["operations_approver"],
          },
        },
      );

    this.configurations.activate(
      approvedConfiguration.id,
      systemActor,
    );

    const policy = this.policies.create({
      key: "avos.runtime.change-risk",
      name: "AVOS Runtime Change Risk Policy",
      description:
        "Production rules for runtime changes and emergency operations",
      environment: RuntimeEnvironment.PRODUCTION,
      namespace: "avos-core",
      defaultDecision:
        RuntimeDecision.ALLOW_WITH_MONITORING,
      defaultRiskLevel: RuntimeRiskLevel.MEDIUM,
      rules: [
        {
          id: "critical-emergency-change",
          name: "Block unsafe emergency changes",
          description:
            "Blocks critical emergency changes without rollback readiness",
          priority: 1000,
          enabled: true,
          conditions: [
            {
              field: "changeType",
              operator: "eq",
              value: RuntimeChangeType.EMERGENCY,
            },
            {
              field: "rollbackReady",
              operator: "eq",
              value: false,
            },
          ],
          decision: RuntimeDecision.BLOCK,
          riskLevel: RuntimeRiskLevel.CRITICAL,
          requiredApprovals: 3,
          actionTypes: [
            ResilienceActionType.LOCKDOWN,
            ResilienceActionType.NOTIFY,
          ],
          metadata: {
            category: "emergency_protection",
          },
        },
        {
          id: "high-blast-radius-change",
          name: "Require approval for wide blast radius",
          description:
            "Requires approval when blast radius is high",
          priority: 900,
          enabled: true,
          conditions: [
            {
              field: "blastRadius",
              operator: "gte",
              value: 70,
            },
          ],
          decision:
            RuntimeDecision.REQUIRE_APPROVAL,
          riskLevel: RuntimeRiskLevel.HIGH,
          requiredApprovals: 2,
          actionTypes: [
            ResilienceActionType.NOTIFY,
          ],
          metadata: {
            category: "blast_radius",
          },
        },
        {
          id: "low-test-coverage",
          name: "Monitor low test coverage",
          description:
            "Adds monitoring requirements for low coverage",
          priority: 800,
          enabled: true,
          conditions: [
            {
              field: "testCoverage",
              operator: "lt",
              value: 75,
            },
          ],
          decision:
            RuntimeDecision.ALLOW_WITH_MONITORING,
          riskLevel: RuntimeRiskLevel.MEDIUM,
          requiredApprovals: 1,
          actionTypes: [
            ResilienceActionType.NOTIFY,
          ],
          metadata: {
            category: "quality_gate",
          },
        },
      ],
      actor: systemActor,
    });

    const activePolicy =
      this.policies.activate(
        policy.id,
        systemActor,
      );

    this.risk.evaluate({
      configurationId: configuration.id,
      policyId: activePolicy.id,
      environment: RuntimeEnvironment.PRODUCTION,
      namespace: "avos-core",
      changeType: RuntimeChangeType.CONFIGURATION,
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
      environment: RuntimeEnvironment.PRODUCTION,
      namespace: "avos-core",
      service: "runtime-resilience-control-plane",
      type: RuntimeSignalType.HEALTH,
      status: RuntimeSignalStatus.HEALTHY,
      value: 1,
      unit: "boolean",
      thresholdWarning: 0.75,
      thresholdCritical: 0.5,
      message:
        "Runtime resilience control plane initialized",
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
      environment: RuntimeEnvironment.PRODUCTION,
      namespace: "avos-core",
      metadata: {
        source: "bootstrap",
        version: "v8-mega-pack-3",
      },
      actor: systemActor,
    });
  }
}
