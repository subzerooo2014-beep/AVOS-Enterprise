import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  UNIVERSAL_INDUSTRY_CAPABILITIES,
  UNIVERSAL_INDUSTRY_CORE_VERSION,
} from "./universal-industry-core.registry";
import {
  IndustryAsset,
  IndustryDefinition,
  IndustryDocument,
  IndustryFinancialEntry,
  IndustryInsight,
  IndustryKpi,
  IndustryPlugin,
  IndustryRisk,
  IndustryRuntimeInstance,
  IndustryTemplate,
  IndustryWorkflow,
  UniversalIndustryCapability,
} from "./universal-industry-core.types";

@Injectable()
export class UniversalIndustryCoreService {
  private readonly definitions = new Map<string, IndustryDefinition>();
  private readonly runtimes = new Map<string, IndustryRuntimeInstance>();
  private readonly workflows = new Map<string, IndustryWorkflow>();
  private readonly assets = new Map<string, IndustryAsset>();
  private readonly finances = new Map<string, IndustryFinancialEntry>();
  private readonly risks = new Map<string, IndustryRisk>();
  private readonly insights = new Map<string, IndustryInsight>();
  private readonly kpis = new Map<string, IndustryKpi>();
  private readonly documents = new Map<string, IndustryDocument>();
  private readonly plugins = new Map<string, IndustryPlugin>();
  private readonly templates = new Map<string, IndustryTemplate>();
  private readonly industryCodes = new Set<string>();

  framework() {
    return {
      system: "AVOS Universal Industry Core V1",
      version: UNIVERSAL_INDUSTRY_CORE_VERSION,
      status: "READY",
      capabilityCount: Object.keys(UNIVERSAL_INDUSTRY_CAPABILITIES).length,
      capabilities: structuredClone(UNIVERSAL_INDUSTRY_CAPABILITIES),
    };
  }

  registerIndustry(
    input: Omit<IndustryDefinition, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    const code = input.code.trim().toUpperCase();

    if (!code || !input.name.trim()) {
      throw new Error("Industry code and name are required");
    }

    if (this.industryCodes.has(code)) {
      throw new Error(`Industry already registered: ${code}`);
    }

    this.assertCapabilities(input.capabilities);

    const now = new Date().toISOString();
    const definition: IndustryDefinition = {
      ...input,
      id: randomUUID(),
      code,
      name: input.name.trim(),
      capabilities: [...input.capabilities],
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.definitions.set(definition.id, definition);
    this.industryCodes.add(code);

    return this.cloneDefinition(definition);
  }

  activateIndustry(id: string) {
    const definition = this.requireDefinition(id);
    definition.status = "ACTIVE";
    definition.updatedAt = new Date().toISOString();
    this.definitions.set(id, definition);
    return this.cloneDefinition(definition);
  }

  provisionRuntime(
    industryCode: string,
    input: Omit<
      IndustryRuntimeInstance,
      "id" | "industryCode" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const normalized = industryCode.trim().toUpperCase();
    const definition = Array.from(this.definitions.values()).find(
      (item) => item.code === normalized && item.status === "ACTIVE",
    );

    if (!definition) {
      throw new Error(`Active industry definition not found: ${normalized}`);
    }

    const now = new Date().toISOString();
    const runtime: IndustryRuntimeInstance = {
      ...input,
      id: randomUUID(),
      industryCode: normalized,
      status: "PROVISIONING",
      configuration: { ...input.configuration },
      createdAt: now,
      updatedAt: now,
    };

    this.runtimes.set(runtime.id, runtime);
    return this.cloneRuntime(runtime);
  }

  activateRuntime(id: string) {
    const runtime = this.requireRuntime(id);
    runtime.status = "ACTIVE";
    runtime.updatedAt = new Date().toISOString();
    this.runtimes.set(id, runtime);
    return this.cloneRuntime(runtime);
  }

  createWorkflow(
    runtimeId: string,
    input: Omit<IndustryWorkflow, "id" | "runtimeId" | "status" | "createdAt" | "updatedAt">,
  ) {
    this.requireRuntime(runtimeId);

    const now = new Date().toISOString();
    const workflow: IndustryWorkflow = {
      ...input,
      id: randomUUID(),
      runtimeId,
      status: "DRAFT",
      steps: [...input.steps],
      createdAt: now,
      updatedAt: now,
    };

    this.workflows.set(workflow.id, workflow);
    return this.cloneWorkflow(workflow);
  }

  activateWorkflow(id: string) {
    const workflow = this.requireWorkflow(id);
    workflow.status = "ACTIVE";
    workflow.updatedAt = new Date().toISOString();
    this.workflows.set(id, workflow);
    return this.cloneWorkflow(workflow);
  }

  registerAsset(
    runtimeId: string,
    input: Omit<IndustryAsset, "id" | "runtimeId" | "status" | "createdAt" | "updatedAt">,
  ) {
    this.requireRuntime(runtimeId);

    if (input.value < 0) {
      throw new Error("Asset value cannot be negative");
    }

    const now = new Date().toISOString();
    const asset: IndustryAsset = {
      ...input,
      id: randomUUID(),
      runtimeId,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    this.assets.set(asset.id, asset);
    return { ...asset };
  }

  recordFinancialEntry(
    runtimeId: string,
    input: Omit<IndustryFinancialEntry, "id" | "runtimeId" | "createdAt">,
  ) {
    this.requireRuntime(runtimeId);

    if (!Number.isFinite(input.amount)) {
      throw new Error("Financial amount must be finite");
    }

    const entry: IndustryFinancialEntry = {
      ...input,
      id: randomUUID(),
      runtimeId,
      createdAt: new Date().toISOString(),
    };

    this.finances.set(entry.id, entry);
    return { ...entry };
  }

  registerRisk(
    runtimeId: string,
    input: Omit<IndustryRisk, "id" | "runtimeId" | "status" | "createdAt" | "updatedAt">,
  ) {
    this.requireRuntime(runtimeId);

    if (
      input.probability < 0 ||
      input.probability > 100 ||
      input.impact < 0 ||
      input.impact > 100
    ) {
      throw new Error("Risk scores must be between 0 and 100");
    }

    const now = new Date().toISOString();
    const risk: IndustryRisk = {
      ...input,
      id: randomUUID(),
      runtimeId,
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    };

    this.risks.set(risk.id, risk);
    return { ...risk };
  }

  createInsight(
    runtimeId: string,
    input: Omit<IndustryInsight, "id" | "runtimeId" | "createdAt">,
  ) {
    this.requireRuntime(runtimeId);

    if (input.score < 0 || input.score > 100) {
      throw new Error("Insight score must be between 0 and 100");
    }

    const insight: IndustryInsight = {
      ...input,
      id: randomUUID(),
      runtimeId,
      recommendations: [...input.recommendations],
      createdAt: new Date().toISOString(),
    };

    this.insights.set(insight.id, insight);
    return this.cloneInsight(insight);
  }

  recordKpi(
    runtimeId: string,
    input: Omit<IndustryKpi, "id" | "runtimeId" | "status" | "recordedAt">,
  ) {
    this.requireRuntime(runtimeId);

    const ratio = input.target === 0 ? 1 : input.actual / input.target;
    const kpi: IndustryKpi = {
      ...input,
      id: randomUUID(),
      runtimeId,
      status: ratio >= 1 ? "ON_TRACK" : ratio >= 0.8 ? "AT_RISK" : "OFF_TRACK",
      recordedAt: new Date().toISOString(),
    };

    this.kpis.set(kpi.id, kpi);
    return { ...kpi };
  }

  registerDocument(
    runtimeId: string,
    input: Omit<IndustryDocument, "id" | "runtimeId" | "status" | "createdAt" | "updatedAt">,
  ) {
    this.requireRuntime(runtimeId);

    const now = new Date().toISOString();
    const document: IndustryDocument = {
      ...input,
      id: randomUUID(),
      runtimeId,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.documents.set(document.id, document);
    return { ...document };
  }

  registerPlugin(
    input: Omit<IndustryPlugin, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    this.assertCapabilities(input.capabilities);

    const now = new Date().toISOString();
    const plugin: IndustryPlugin = {
      ...input,
      id: randomUUID(),
      capabilities: [...input.capabilities],
      status: "REGISTERED",
      createdAt: now,
      updatedAt: now,
    };

    this.plugins.set(plugin.id, plugin);
    return this.clonePlugin(plugin);
  }

  publishTemplate(
    input: Omit<IndustryTemplate, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const template: IndustryTemplate = {
      ...input,
      id: randomUUID(),
      code: input.code.trim().toUpperCase(),
      configuration: { ...input.configuration },
      status: "PUBLISHED",
      createdAt: now,
      updatedAt: now,
    };

    this.templates.set(template.id, template);
    return this.cloneTemplate(template);
  }

  listIndustries() {
    return Array.from(this.definitions.values()).map((item) =>
      this.cloneDefinition(item),
    );
  }

  commandCenter() {
    const runtimes = Array.from(this.runtimes.values());
    const risks = Array.from(this.risks.values());
    const kpis = Array.from(this.kpis.values());
    const finances = Array.from(this.finances.values());

    return {
      system: "AVOS Universal Industry Core V1",
      industries: this.definitions.size,
      activeIndustries: Array.from(this.definitions.values()).filter(
        (item) => item.status === "ACTIVE",
      ).length,
      runtimes: runtimes.length,
      activeRuntimes: runtimes.filter((item) => item.status === "ACTIVE").length,
      workflows: this.workflows.size,
      assets: this.assets.size,
      financialEntries: finances.length,
      totalFinancialVolume: Number(
        finances.reduce((sum, item) => sum + item.amount, 0).toFixed(2),
      ),
      openRisks: risks.filter((item) => item.status !== "CLOSED").length,
      criticalRisks: risks.filter(
        (item) => item.status !== "CLOSED" && item.severity === "CRITICAL",
      ).length,
      insights: this.insights.size,
      kpis: kpis.length,
      onTrackKpis: kpis.filter((item) => item.status === "ON_TRACK").length,
      documents: this.documents.size,
      plugins: this.plugins.size,
      templates: this.templates.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private assertCapabilities(capabilities: UniversalIndustryCapability[]) {
    for (const capability of capabilities) {
      if (!UNIVERSAL_INDUSTRY_CAPABILITIES[capability]) {
        throw new Error(`Unknown capability: ${capability}`);
      }
    }
  }

  private requireDefinition(id: string) {
    const item = this.definitions.get(id);
    if (!item) {
      throw new Error(`Industry definition not found: ${id}`);
    }
    return item;
  }

  private requireRuntime(id: string) {
    const item = this.runtimes.get(id);
    if (!item) {
      throw new Error(`Industry runtime not found: ${id}`);
    }
    return item;
  }

  private requireWorkflow(id: string) {
    const item = this.workflows.get(id);
    if (!item) {
      throw new Error(`Industry workflow not found: ${id}`);
    }
    return item;
  }

  private cloneDefinition(item: IndustryDefinition): IndustryDefinition {
    return { ...item, capabilities: [...item.capabilities] };
  }

  private cloneRuntime(item: IndustryRuntimeInstance): IndustryRuntimeInstance {
    return { ...item, configuration: { ...item.configuration } };
  }

  private cloneWorkflow(item: IndustryWorkflow): IndustryWorkflow {
    return { ...item, steps: [...item.steps] };
  }

  private cloneInsight(item: IndustryInsight): IndustryInsight {
    return { ...item, recommendations: [...item.recommendations] };
  }

  private clonePlugin(item: IndustryPlugin): IndustryPlugin {
    return { ...item, capabilities: [...item.capabilities] };
  }

  private cloneTemplate(item: IndustryTemplate): IndustryTemplate {
    return { ...item, configuration: { ...item.configuration } };
  }
}