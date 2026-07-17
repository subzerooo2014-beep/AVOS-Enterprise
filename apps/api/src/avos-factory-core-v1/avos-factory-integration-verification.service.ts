import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryIntegrationVerification
} from "./avos-factory-integration.contracts";
import {
  AvosFactoryDigitalDNAService
} from "./avos-factory-digital-dna.service";
import {
  AvosFactoryIntegrationRegistryService
} from "./avos-factory-integration-registry.service";
import {
  AvosFactoryLivingBlueprintService
} from "./avos-factory-living-blueprint.service";

@Injectable()
export class AvosFactoryIntegrationVerificationService {
  constructor(
    private readonly registry:
      AvosFactoryIntegrationRegistryService,
    private readonly blueprint:
      AvosFactoryLivingBlueprintService,
    private readonly digitalDNA:
      AvosFactoryDigitalDNAService
  ) {}

  run():
    AvosFactoryIntegrationVerification {
    const registry =
      this.registry.getRegistry();

    const blueprint =
      this.blueprint.latest() ??
      this.blueprint.register();

    const digitalDNA =
      this.digitalDNA.latest() ??
      this.digitalDNA.generate();

    const requiredIntegrations =
      registry.integrations.filter(
        (item) =>
          item.requiredForProduction
      );

    const checks = {
      enterpriseKernelDetected:
        this.isDetected(
          registry,
          "enterprise-kernel"
        ),
      capabilityFabricDetected:
        this.isDetected(
          registry,
          "capability-fabric"
        ),
      knowledgeFabricDetected:
        this.isDetected(
          registry,
          "knowledge-fabric"
        ),
      livingBlueprintRegistered:
        blueprint.capabilities.length > 0,
      digitalDNAGenerated:
        digitalDNA.capabilities.length > 0,
      foundationFirst:
        registry.foundationFirst,
      capabilityFirst:
        registry.capabilityFirst,
      blueprintDriven:
        registry.blueprintDriven,
      humanFinalAuthority:
        registry.humanFinalAuthority,
      requiredIntegrationsAvailable:
        requiredIntegrations.every(
          (item) =>
            item.status !== "not-detected"
        )
    };

    const blockingFindings =
      Object.entries(checks)
        .filter(([, passed]) => !passed)
        .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks)
          .filter(Boolean)
          .length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      id: randomUUID(),
      passed:
        blockingFindings.length === 0 &&
        score === 100,
      score,
      checks,
      registry,
      blueprint,
      digitalDNA,
      blockingFindings,
      generatedAt:
        new Date().toISOString()
    };
  }

  private isDetected(
    registry:
      ReturnType<
        AvosFactoryIntegrationRegistryService["getRegistry"]
      >,
    target:
      "enterprise-kernel"
      | "capability-fabric"
      | "knowledge-fabric"
  ): boolean {
    const integration =
      registry.integrations.find(
        (item) =>
          item.target === target
      );

    return Boolean(
      integration &&
      integration.status !== "not-detected"
    );
  }
}
