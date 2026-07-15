import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AiModelRegistration,
  DataAiIntegrationHealth,
  FeatureDefinition,
  GlobalDataAsset,
  GovernanceDecision,
  IntegrationEndpoint,
} from "./data-ai-integration.types";

@Injectable()
export class DataAiIntegrationService {
  private readonly dataAssets = new Map<string, GlobalDataAsset>();
  private readonly models = new Map<string, AiModelRegistration>();
  private readonly features = new Map<string, FeatureDefinition>();
  private readonly integrations = new Map<string, IntegrationEndpoint>();
  private readonly events: Array<Record<string, unknown>> = [];

  registerDataAsset(
    input: Omit<GlobalDataAsset, "id" | "createdAt" | "updatedAt">,
  ): GlobalDataAsset {
    const now = new Date().toISOString();
    const asset: GlobalDataAsset = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      metadata: { ...input.metadata },
    };

    this.dataAssets.set(asset.id, asset);
    this.publishEvent("GlobalDataAssetRegistered", {
      assetId: asset.id,
      tenantId: asset.tenantId,
      type: asset.type,
    });

    return this.cloneAsset(asset);
  }

  listDataAssets(): GlobalDataAsset[] {
    return Array.from(this.dataAssets.values()).map((item) =>
      this.cloneAsset(item),
    );
  }

  registerModel(
    input: Omit<AiModelRegistration, "id" | "createdAt" | "updatedAt">,
  ): AiModelRegistration {
    const now = new Date().toISOString();
    const model: AiModelRegistration = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      metrics: { ...input.metrics },
    };

    this.models.set(model.id, model);
    this.publishEvent("AiModelRegistered", {
      modelId: model.id,
      tenantId: model.tenantId,
      version: model.version,
    });

    return this.cloneModel(model);
  }

  deployModel(id: string): AiModelRegistration {
    const model = this.models.get(id);

    if (!model) {
      throw new Error(`Model not found: ${id}`);
    }

    if (!model.governanceApproved) {
      throw new Error("Model cannot be deployed without governance approval");
    }

    model.status = "DEPLOYED";
    model.updatedAt = new Date().toISOString();
    this.models.set(id, model);

    this.publishEvent("AiModelDeployed", {
      modelId: model.id,
      tenantId: model.tenantId,
      region: model.region,
    });

    return this.cloneModel(model);
  }

  listModels(): AiModelRegistration[] {
    return Array.from(this.models.values()).map((item) =>
      this.cloneModel(item),
    );
  }

  registerFeature(
    input: Omit<FeatureDefinition, "id" | "createdAt">,
  ): FeatureDefinition {
    const feature: FeatureDefinition = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.features.set(feature.id, feature);
    this.publishEvent("FeatureRegistered", {
      featureId: feature.id,
      tenantId: feature.tenantId,
      entity: feature.entity,
    });

    return { ...feature };
  }

  listFeatures(): FeatureDefinition[] {
    return Array.from(this.features.values()).map((item) => ({ ...item }));
  }

  registerIntegration(
    input: Omit<IntegrationEndpoint, "id" | "createdAt" | "updatedAt">,
  ): IntegrationEndpoint {
    const now = new Date().toISOString();
    const integration: IntegrationEndpoint = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.integrations.set(integration.id, integration);
    this.publishEvent("IntegrationRegistered", {
      integrationId: integration.id,
      tenantId: integration.tenantId,
      protocol: integration.protocol,
    });

    return { ...integration };
  }

  listIntegrations(): IntegrationEndpoint[] {
    return Array.from(this.integrations.values()).map((item) => ({
      ...item,
    }));
  }

  evaluateGovernance(
    classification: GlobalDataAsset["classification"],
    crossRegion: boolean,
    encrypted: boolean,
  ): GovernanceDecision {
    const reasons: string[] = [];

    if (
      (classification === "CONFIDENTIAL" ||
        classification === "RESTRICTED") &&
      !encrypted
    ) {
      reasons.push("Sensitive data requires encryption");
    }

    if (classification === "RESTRICTED" && crossRegion) {
      reasons.push("Restricted data cannot cross regions without approval");
    }

    return {
      allowed: reasons.length === 0,
      reasons,
      evaluatedAt: new Date().toISOString(),
    };
  }

  publishEvent(
    eventType: string,
    payload: Record<string, unknown>,
  ) {
    const event = {
      id: randomUUID(),
      eventType,
      payload,
      streamingEnabled: true,
      observable: true,
      occurredAt: new Date().toISOString(),
    };

    this.events.push(event);
    return { ...event };
  }

  listEvents() {
    return this.events.map((item) => ({ ...item }));
  }

  getHealth(): DataAiIntegrationHealth {
    const models = this.listModels();
    const integrations = this.listIntegrations();
    const approvedModels = models.filter(
      (item) => item.governanceApproved,
    ).length;

    const governanceScore =
      models.length === 0
        ? 100
        : Math.round((approvedModels / models.length) * 100);

    return {
      system: "AVOS Global Platform",
      component: "Global Data, AI & Integration",
      status: governanceScore >= 80 ? "HEALTHY" : "DEGRADED",
      dataAssets: this.dataAssets.size,
      models: models.length,
      deployedModels: models.filter(
        (item) => item.status === "DEPLOYED",
      ).length,
      features: this.features.size,
      integrations: integrations.length,
      enabledIntegrations: integrations.filter(
        (item) => item.enabled,
      ).length,
      governanceScore,
      generatedAt: new Date().toISOString(),
    };
  }

  private cloneAsset(item: GlobalDataAsset): GlobalDataAsset {
    return {
      ...item,
      metadata: { ...item.metadata },
    };
  }

  private cloneModel(item: AiModelRegistration): AiModelRegistration {
    return {
      ...item,
      metrics: { ...item.metrics },
    };
  }
}