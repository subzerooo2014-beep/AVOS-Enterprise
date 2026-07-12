import { randomUUID } from "node:crypto";
import {
  V4BackendArtifact,
  V4BackendInput,
  V4BackendStatus,
} from "./contracts";
import { V4DtoGenerator } from "./dto-generator";
import { V4RepositoryGenerator } from "./repository-generator";
import { V4ServiceGenerator } from "./service-generator";
import { V4ControllerGenerator } from "./controller-generator";
import { V4ModuleGenerator } from "./module-generator";
import { V4PolicyEventGenerator } from "./policy-event-generator";
import { V4BackendTestGenerator } from "./test-generator";
import { backendKebab } from "./name-utils";

export interface V4BackendGenerationResult {
  success: boolean;
  status: V4BackendStatus;
  score: number;
  artifacts: V4BackendArtifact[];
  modules: number;
  controllers: number;
  services: number;
  dtos: number;
  repositories: number;
  policies: number;
  events: number;
  tests: number;
  enterpriseBrainPayload: Record<string, unknown>;
  evolutionCenterPayload: Record<string, unknown>;
  evidence: Array<{
    id: string;
    action: string;
    message: string;
    createdAt: string;
  }>;
  completedAt: string;
}

export class GenesisV4ProductionBackendOrchestrator {
  constructor(
    readonly dtoGenerator = new V4DtoGenerator(),
    readonly repositoryGenerator = new V4RepositoryGenerator(),
    readonly serviceGenerator = new V4ServiceGenerator(),
    readonly controllerGenerator = new V4ControllerGenerator(),
    readonly moduleGenerator = new V4ModuleGenerator(),
    readonly policyEventGenerator = new V4PolicyEventGenerator(),
    readonly testGenerator = new V4BackendTestGenerator(),
  ) {}

  execute(input: V4BackendInput): V4BackendGenerationResult {
    const artifacts: V4BackendArtifact[] = [];
    const enableRbac = input.enableRbac !== false;
    const enableAudit = input.enableAudit !== false;
    const enableEvents = input.enableEvents !== false;
    const enableOpenApi = input.enableOpenApi !== false;

    for (const domain of input.domains) {
      artifacts.push(
        ...this.dtoGenerator.generate(domain),
        ...this.repositoryGenerator.generate(domain),
        this.serviceGenerator.generate(domain, {
          enableAudit,
          enableEvents,
        }),
        this.controllerGenerator.generate(domain, {
          enableRbac,
          enableOpenApi,
        }),
        this.moduleGenerator.generate(domain),
        ...this.policyEventGenerator.generate(domain, {
          enableRbac,
          enableEvents,
        }),
        ...this.testGenerator.generate(domain),
        {
          relativePath: `apps/api/src/${backendKebab(domain.key)}/index.ts`,
          kind: "index",
          content: `export * from "./${backendKebab(domain.key)}.module";
export * from "./${backendKebab(domain.key)}.service";
export * from "./${backendKebab(domain.key)}.controller";
`,
          metadata: { domain: domain.key },
        },
      );
    }

    const duplicatePaths = artifacts
      .map((artifact) => artifact.relativePath)
      .filter((item, index, all) => all.indexOf(item) !== index);

    const perDomainExpected = 11;
    const expectedMinimum = input.domains.length * perDomainExpected;
    const coverage = expectedMinimum === 0
      ? 0
      : Math.min(
          100,
          Math.round((artifacts.length / expectedMinimum) * 100),
        );

    const featureScore = [
      enableRbac,
      enableAudit,
      enableEvents,
      enableOpenApi,
    ].filter(Boolean).length * 25;

    const score = Math.round((coverage + featureScore + 100) / 3);

    const success =
      input.domains.length > 0 &&
      duplicatePaths.length === 0 &&
      artifacts.length >= expectedMinimum &&
      score >= 80;

    const status = success
      ? V4BackendStatus.READY
      : score >= 60
        ? V4BackendStatus.DEGRADED
        : V4BackendStatus.BLOCKED;

    const count = (kind: V4BackendArtifact["kind"]) =>
      artifacts.filter((artifact) => artifact.kind === kind).length;

    return {
      success,
      status,
      score,
      artifacts,
      modules: count("module"),
      controllers: count("controller"),
      services: count("service"),
      dtos: count("dto"),
      repositories: count("repository"),
      policies: count("policy"),
      events: count("event"),
      tests: count("test"),
      enterpriseBrainPayload: {
        type: "genesis-v4-production-backend",
        systemKey: input.systemKey,
        domains: input.domains.map((domain) => domain.key),
        artifactCount: artifacts.length,
        capabilities: [
          "nestjs",
          "validation",
          "rbac",
          "audit",
          "events",
          "repositories",
          "tests",
        ],
      },
      evolutionCenterPayload: {
        type: "genesis-v4-backend-baseline",
        systemKey: input.systemKey,
        score,
        artifacts: artifacts.length,
        modules: count("module"),
        controllers: count("controller"),
        services: count("service"),
        tests: count("test"),
      },
      evidence: [
        {
          id: randomUUID(),
          action: "genesis-v4.production-backend.completed",
          message: `Production backend generated with ${artifacts.length} artifacts.`,
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}
