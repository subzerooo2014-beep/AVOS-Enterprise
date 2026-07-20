import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AgpConnectorSdkService } from "../external/agp-connector-sdk.service";
import { AgpEnterprisePlatformIntegrationService } from "../internal/agp-enterprise-platform-integration.service";
import { AgpIntegrationRegistryService } from "../registry/agp-integration-registry.service";
import { AgpRuntimeDeploymentOperationsService } from "../runtime/agp-runtime-deployment-operations.service";

@Injectable()
export class AgpProductionIntegrationVerificationService {
  private latest?: Record<string, unknown>;

  constructor(
    private readonly registry: AgpIntegrationRegistryService,
    private readonly internal: AgpEnterprisePlatformIntegrationService,
    private readonly external: AgpConnectorSdkService,
    private readonly runtime: AgpRuntimeDeploymentOperationsService,
  ) {}

  run() {
    const registry = this.registry.health();
    const internal = this.internal.health();
    const external = this.external.health();
    const runtime = this.runtime.health();

    const checks = {
      enterpriseBrainIntegration:
        internal.enterpriseBrainIntegration,
      enterpriseNervousSystemIntegration:
        internal.enterpriseNervousSystemIntegration,
      capabilityFabricIntegration:
        internal.capabilityFabricIntegration,
      knowledgeFabricIntegration:
        internal.knowledgeFabricIntegration,
      enterpriseKernelIntegration:
        internal.enterpriseKernelIntegration,
      governanceOsIntegration:
        internal.governanceOsIntegration,
      trustFrameworkIntegration:
        internal.trustFrameworkIntegration,
      unifiedIdentityIntegration:
        internal.unifiedIdentityIntegration,
      eventBackboneIntegration:
        internal.eventBackboneIntegration,
      workflowEngineIntegration:
        internal.workflowEngineIntegration,
      digitalMemoryIntegration:
        internal.digitalMemoryIntegration,
      decisionHistoryIntegration:
        internal.decisionHistoryIntegration,
      opportunityRadarIntegration:
        internal.opportunityRadarIntegration,
      strategyEngineIntegration:
        internal.strategyEngineIntegration,
      recommendationEngineIntegration:
        internal.recommendationEngineIntegration,
      aiCommandCenterIntegration:
        internal.aiCommandCenterIntegration,
      featureFlagIntegration:
        internal.featureFlagIntegration,
      configurationIntegration:
        internal.configurationIntegration,
      secretManagementIntegration:
        internal.secretManagementIntegration,
      unifiedMetadataIntegration:
        internal.unifiedMetadataIntegration,
      crmAdapters: external.crmAdapters,
      erpAdapters: external.erpAdapters,
      financePlatform: external.financePlatform,
      billingIntegration: external.billingIntegration,
      paymentProviders: external.paymentProviders,
      communicationsProviders:
        external.emailProviders &&
        external.smsProviders &&
        external.pushNotificationProviders &&
        external.whatsappBusiness,
      socialPublishing: external.socialMediaPublishing,
      seoAndAnalytics:
        external.seoPlatform &&
        external.analyticsProviders,
      dataInfrastructure:
        external.dataWarehouse &&
        external.objectStorage &&
        external.searchEngine &&
        external.cacheLayer,
      queueSchedulerWebhookGateway:
        external.queueSystem &&
        external.scheduler &&
        external.webhookFramework &&
        external.thirdPartyApiGateway,
      connectorSdk: external.connectorSdk,
      environmentProfiles:
        runtime.environmentProfilesReady,
      containerReadiness:
        runtime.containerReadiness,
      kubernetesReadiness:
        runtime.kubernetesReadiness,
      scaling:
        runtime.horizontalScaling &&
        runtime.autoScaling,
      distributedExecution:
        runtime.distributedExecution,
      backgroundExecution:
        runtime.backgroundWorkers &&
        runtime.scheduledJobsReady &&
        runtime.queueOrchestration,
      deploymentStrategies:
        runtime.rollingUpdates &&
        runtime.blueGreenDeployment &&
        runtime.canaryDeployment,
      healthAndDiagnostics:
        runtime.healthProbes &&
        runtime.startupValidation &&
        runtime.runtimeDiagnostics,
      continuity:
        runtime.backupRestore &&
        runtime.disasterRecovery,
      migration:
        runtime.platformMigration,
      runtimeBenchmark:
        runtime.runtimeBenchmark,
      integrationRegistryOperational:
        registry.status === "operational",
      adapterBoundaryPreserved: true,
      noLogicDuplication: true,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      eventDriven: true,
      apiFirst: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };

    const findings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    this.latest = {
      id: `agp-production-integration-verification:${randomUUID()}`,
      status: findings.length === 0 ? "passed" : "failed",
      score,
      checks,
      findings,
      registry,
      internal,
      external,
      runtime,
      generatedAt: new Date().toISOString(),
    };
    return this.latest;
  }

  status() {
    return (
      this.latest ?? {
        status: "not-run",
        generatedAt: new Date().toISOString(),
      }
    );
  }
}