import { Injectable } from "@nestjs/common";
import {
  AutonomousFactoryBlueprintInput,
  AutonomousTargetFramework,
  CompiledApplication,
  CompiledCapability,
  CompiledFactoryBlueprint,
} from "../contracts/autonomous-factory.contracts";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryBlueprintCompilerService {
  compile(input: AutonomousFactoryBlueprintInput): CompiledFactoryBlueprint {
    if (!input.capabilities.length) {
      throw new Error("At least one capability is required.");
    }

    const capabilities = input.capabilities.map((capability) =>
      this.compileCapability(capability),
    );

    const knownCapabilityIds = new Set(
      capabilities.flatMap((capability) => [capability.id, capability.slug]),
    );

    const applications = (input.applications ?? []).map((application) => {
      const capabilityIds = application.capabilities.map((reference) => {
        const slug = this.toSlug(reference);
        if (!knownCapabilityIds.has(slug)) {
          throw new Error(
            `Application '${application.name}' references unknown capability '${reference}'.`,
          );
        }
        return slug;
      });

      return {
        id: this.toSlug(application.name),
        name: application.name,
        slug: this.toSlug(application.name),
        framework: this.normalizeFramework(application.framework),
        objective: application.objective,
        capabilityIds,
        metadata: application.metadata ?? {},
      } satisfies CompiledApplication;
    });

    if (!applications.length) {
      applications.push({
        id: `${this.toSlug(input.name)}-api`,
        name: `${input.name} API`,
        slug: `${this.toSlug(input.name)}-api`,
        framework: "nestjs",
        objective: input.objective,
        capabilityIds: capabilities.map((capability) => capability.id),
        metadata: {
          autoCreated: true,
        },
      });
    }

    return {
      id: createFactoryId("factory-compiled-blueprint"),
      projectId: input.projectId,
      name: input.name,
      slug: this.toSlug(input.name),
      objective: input.objective,
      version: input.version ?? "1.0.0",
      capabilities,
      applications,
      qualityThreshold: input.qualityThreshold ?? 90,
      humanFinalAuthority: true,
      metadata: {
        ...(input.metadata ?? {}),
        requestedHumanFinalAuthority: input.humanFinalAuthority ?? true,
        architecture: "capability-first",
        foundationFirst: true,
      },
      compiledAt: new Date().toISOString(),
    };
  }

  private compileCapability(
    input: AutonomousFactoryBlueprintInput["capabilities"][number],
  ): CompiledCapability {
    const slug = this.toSlug(input.name);

    return {
      id: slug,
      name: input.name,
      slug,
      className: this.toPascalCase(input.name),
      objective: input.objective,
      version: input.version ?? "1.0.0",
      dependencies: (input.dependencies ?? []).map((value) =>
        this.toSlug(value),
      ),
      exposeApi: input.exposeApi ?? true,
      persistence: input.persistence ?? false,
      humanApprovalRequired: input.humanApprovalRequired ?? true,
      metadata: input.metadata ?? {},
    };
  }

  private normalizeFramework(value: string): AutonomousTargetFramework {
    const normalized = value.trim().toLowerCase();

    if (
      normalized === "nestjs" ||
      normalized === "nextjs" ||
      normalized === "flutter" ||
      normalized === "node" ||
      normalized === "generic"
    ) {
      return normalized;
    }

    throw new Error(`Unsupported framework '${value}'.`);
  }

  private toSlug(value: string) {
    return value
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  }

  private toPascalCase(value: string) {
    return this.toSlug(value)
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }
}
