import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { UniversalIndustryCoreService } from "../universal-industry-core/universal-industry-core.service";
import {
  INDUSTRY_FACTORY_CAPABILITIES,
  INDUSTRY_FACTORY_VERSION,
} from "./industry-factory.registry";
import {
  IndustryBlueprint,
  IndustryGenerationJob,
  IndustryInstallation,
  IndustryMarketplaceEntry,
  IndustryValidationResult,
} from "./industry-factory.types";

@Injectable()
export class IndustryFactoryService {
  private readonly blueprints = new Map<string, IndustryBlueprint>();
  private readonly jobs = new Map<string, IndustryGenerationJob>();
  private readonly validations = new Map<string, IndustryValidationResult>();
  private readonly installations = new Map<string, IndustryInstallation>();
  private readonly marketplace = new Map<string, IndustryMarketplaceEntry>();
  private readonly blueprintCodes = new Set<string>();

  constructor(private readonly universalCore: UniversalIndustryCoreService) {}

  framework() {
    return {
      system: "AVOS Industry Factory & Blueprint Studio V1",
      version: INDUSTRY_FACTORY_VERSION,
      status: "READY",
      capabilities: structuredClone(INDUSTRY_FACTORY_CAPABILITIES),
      capabilityCount: Object.keys(INDUSTRY_FACTORY_CAPABILITIES).length,
      targetCore: this.universalCore.framework(),
    };
  }

  createBlueprint(
    input: Omit<
      IndustryBlueprint,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const code = input.code.trim().toUpperCase();

    if (!code || !input.name.trim()) {
      throw new Error("Blueprint code and name are required");
    }

    if (this.blueprintCodes.has(code)) {
      throw new Error(`Blueprint code already exists: ${code}`);
    }

    const now = new Date().toISOString();

    const blueprint: IndustryBlueprint = {
      ...input,
      id: randomUUID(),
      code,
      name: input.name.trim(),
      capabilities: [...new Set(input.capabilities)],
      entities: [...new Set(input.entities)],
      workflows: [...new Set(input.workflows)],
      integrations: [...new Set(input.integrations)],
      uiModules: [...new Set(input.uiModules)],
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.blueprints.set(blueprint.id, blueprint);
    this.blueprintCodes.add(code);

    return this.cloneBlueprint(blueprint);
  }

  validateBlueprint(id: string) {
    const blueprint = this.requireBlueprint(id);
    const knownCoreCapabilities = Object.keys(
      this.universalCore.framework().capabilities,
    );

    const issues: string[] = [];
    const schemaValid =
      blueprint.entities.length > 0 && blueprint.workflows.length > 0;
    const capabilitiesValid = blueprint.capabilities.every((capability) =>
      knownCoreCapabilities.includes(capability),
    );
    const namingValid = /^[A-Z][A-Z0-9_]+$/.test(blueprint.code);
    const compatibilityValid =
      blueprint.targetCoreVersion === "1.0.0" ||
      blueprint.targetCoreVersion.startsWith("1.");

    if (!schemaValid) {
      issues.push("Blueprint must include at least one entity and workflow");
    }

    if (!capabilitiesValid) {
      issues.push("Blueprint contains unsupported core capabilities");
    }

    if (!namingValid) {
      issues.push("Blueprint code must use uppercase snake case");
    }

    if (!compatibilityValid) {
      issues.push("Blueprint target core version is incompatible");
    }

    const passed = [
      schemaValid,
      capabilitiesValid,
      namingValid,
      compatibilityValid,
    ].filter(Boolean).length;

    const result: IndustryValidationResult = {
      blueprintId: id,
      schemaValid,
      capabilitiesValid,
      namingValid,
      compatibilityValid,
      score: passed * 25,
      issues,
      validatedAt: new Date().toISOString(),
    };

    this.validations.set(id, result);

    blueprint.status = result.score === 100 ? "VALIDATED" : "DRAFT";
    blueprint.updatedAt = result.validatedAt;
    this.blueprints.set(id, blueprint);

    return {
      blueprint: this.cloneBlueprint(blueprint),
      result: this.cloneValidation(result),
    };
  }

  publishBlueprint(id: string) {
    const blueprint = this.requireBlueprint(id);
    const validation = this.validations.get(id);

    if (!validation || validation.score !== 100) {
      throw new Error("Blueprint must pass validation before publishing");
    }

    blueprint.status = "PUBLISHED";
    blueprint.updatedAt = new Date().toISOString();
    this.blueprints.set(id, blueprint);

    return this.cloneBlueprint(blueprint);
  }

  createGenerationJob(
    blueprintId: string,
    input: Pick<IndustryGenerationJob, "namespace" | "outputPath">,
  ) {
    const blueprint = this.requireBlueprint(blueprintId);

    if (blueprint.status !== "PUBLISHED") {
      throw new Error("Blueprint must be published before generation");
    }

    const now = new Date().toISOString();

    const job: IndustryGenerationJob = {
      id: randomUUID(),
      blueprintId,
      namespace: input.namespace.trim(),
      outputPath: input.outputPath.trim(),
      status: "PENDING",
      generatedFiles: [],
      warnings: [],
      errors: [],
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(job.id, job);
    return this.cloneJob(job);
  }

  executeGeneration(id: string) {
    const job = this.requireJob(id);
    const blueprint = this.requireBlueprint(job.blueprintId);

    job.status = "RUNNING";
    job.startedAt = new Date().toISOString();
    job.updatedAt = job.startedAt;

    try {
      const base = `${job.outputPath}/${job.namespace}`;

      job.generatedFiles = [
        `${base}/${job.namespace}.types.ts`,
        `${base}/${job.namespace}.registry.ts`,
        `${base}/${job.namespace}.service.ts`,
        `${base}/${job.namespace}.controller.ts`,
        `${base}/${job.namespace}.module.ts`,
        `${base}/index.ts`,
        `apps/web/src/app/${job.namespace}/page.tsx`,
        `apps/mobile/lib/features/${job.namespace}/${job.namespace}_screen.dart`,
        `tools/${job.namespace}/smoke.ps1`,
        `tools/${job.namespace}/integration.ps1`,
        `tools/${job.namespace}/verify.ps1`,
        `docs/industries/${job.namespace}.md`,
      ];

      if (blueprint.integrations.length === 0) {
        job.warnings.push("Blueprint has no external integrations");
      }

      job.status = "COMPLETED";
      job.completedAt = new Date().toISOString();
      job.updatedAt = job.completedAt;
    } catch (error) {
      job.status = "FAILED";
      job.errors.push(
        error instanceof Error ? error.message : "Unknown generation failure",
      );
      job.completedAt = new Date().toISOString();
      job.updatedAt = job.completedAt;
    }

    this.jobs.set(id, job);
    return this.cloneJob(job);
  }

  createInstallation(
    generationJobId: string,
    targetEnvironment: IndustryInstallation["targetEnvironment"],
  ) {
    const job = this.requireJob(generationJobId);

    if (job.status !== "COMPLETED") {
      throw new Error("Generation job must complete before installation");
    }

    const now = new Date().toISOString();

    const installation: IndustryInstallation = {
      id: randomUUID(),
      generationJobId,
      blueprintId: job.blueprintId,
      targetEnvironment,
      status: "PENDING",
      installedFiles: [],
      rollbackFiles: [],
      createdAt: now,
      updatedAt: now,
    };

    this.installations.set(installation.id, installation);
    return this.cloneInstallation(installation);
  }

  install(id: string) {
    const installation = this.requireInstallation(id);
    const job = this.requireJob(installation.generationJobId);

    installation.installedFiles = [...job.generatedFiles];
    installation.rollbackFiles = [...job.generatedFiles].reverse();
    installation.status = "INSTALLED";
    installation.installedAt = new Date().toISOString();
    installation.updatedAt = installation.installedAt;
    this.installations.set(id, installation);

    return this.cloneInstallation(installation);
  }

  rollback(id: string) {
    const installation = this.requireInstallation(id);

    if (installation.status !== "INSTALLED") {
      throw new Error("Only installed packages can be rolled back");
    }

    installation.status = "ROLLED_BACK";
    installation.rolledBackAt = new Date().toISOString();
    installation.updatedAt = installation.rolledBackAt;
    this.installations.set(id, installation);

    return this.cloneInstallation(installation);
  }

  createMarketplaceEntry(
    blueprintId: string,
    input: Pick<IndustryMarketplaceEntry, "publisher" | "visibility">,
  ) {
    const blueprint = this.requireBlueprint(blueprintId);

    if (blueprint.status !== "PUBLISHED") {
      throw new Error("Only published blueprints can enter marketplace");
    }

    const now = new Date().toISOString();

    const entry: IndustryMarketplaceEntry = {
      id: randomUUID(),
      blueprintId,
      publisher: input.publisher.trim(),
      visibility: input.visibility,
      status: "DRAFT",
      rating: 0,
      installs: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.marketplace.set(entry.id, entry);
    return { ...entry };
  }

  publishMarketplaceEntry(id: string) {
    const entry = this.requireMarketplaceEntry(id);
    entry.status = "PUBLISHED";
    entry.updatedAt = new Date().toISOString();
    this.marketplace.set(id, entry);

    return { ...entry };
  }

  listBlueprints() {
    return Array.from(this.blueprints.values()).map((item) =>
      this.cloneBlueprint(item),
    );
  }

  listJobs() {
    return Array.from(this.jobs.values()).map((item) => this.cloneJob(item));
  }

  commandCenter() {
    const blueprints = Array.from(this.blueprints.values());
    const jobs = Array.from(this.jobs.values());
    const installations = Array.from(this.installations.values());
    const marketplace = Array.from(this.marketplace.values());

    return {
      system: "AVOS Industry Factory & Blueprint Studio V1",
      blueprints: blueprints.length,
      validatedBlueprints: blueprints.filter(
        (item) => item.status === "VALIDATED",
      ).length,
      publishedBlueprints: blueprints.filter(
        (item) => item.status === "PUBLISHED",
      ).length,
      generationJobs: jobs.length,
      completedJobs: jobs.filter((item) => item.status === "COMPLETED").length,
      failedJobs: jobs.filter((item) => item.status === "FAILED").length,
      installations: installations.length,
      activeInstallations: installations.filter(
        (item) => item.status === "INSTALLED",
      ).length,
      rolledBackInstallations: installations.filter(
        (item) => item.status === "ROLLED_BACK",
      ).length,
      marketplaceEntries: marketplace.length,
      publishedMarketplaceEntries: marketplace.filter(
        (item) => item.status === "PUBLISHED",
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireBlueprint(id: string) {
    const item = this.blueprints.get(id);

    if (!item) {
      throw new Error(`Blueprint not found: ${id}`);
    }

    return item;
  }

  private requireJob(id: string) {
    const item = this.jobs.get(id);

    if (!item) {
      throw new Error(`Generation job not found: ${id}`);
    }

    return item;
  }

  private requireInstallation(id: string) {
    const item = this.installations.get(id);

    if (!item) {
      throw new Error(`Installation not found: ${id}`);
    }

    return item;
  }

  private requireMarketplaceEntry(id: string) {
    const item = this.marketplace.get(id);

    if (!item) {
      throw new Error(`Marketplace entry not found: ${id}`);
    }

    return item;
  }

  private cloneBlueprint(item: IndustryBlueprint): IndustryBlueprint {
    return {
      ...item,
      capabilities: [...item.capabilities],
      entities: [...item.entities],
      workflows: [...item.workflows],
      integrations: [...item.integrations],
      uiModules: [...item.uiModules],
    };
  }

  private cloneValidation(
    item: IndustryValidationResult,
  ): IndustryValidationResult {
    return {
      ...item,
      issues: [...item.issues],
    };
  }

  private cloneJob(item: IndustryGenerationJob): IndustryGenerationJob {
    return {
      ...item,
      generatedFiles: [...item.generatedFiles],
      warnings: [...item.warnings],
      errors: [...item.errors],
    };
  }

  private cloneInstallation(
    item: IndustryInstallation,
  ): IndustryInstallation {
    return {
      ...item,
      installedFiles: [...item.installedFiles],
      rollbackFiles: [...item.rollbackFiles],
    };
  }
}