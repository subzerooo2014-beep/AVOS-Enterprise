import {
  GenesisV3Artifact,
  GenesisV3Specification,
  GenesisV3Status,
} from "./contracts";
import { GenesisV3BackendGenerator } from "./backend-generator";
import { GenesisV3PrismaGenerator } from "./prisma-generator";
import { GenesisV3FrontendGenerator } from "./frontend-generator";
import { GenesisV3PlatformGenerator } from "./platform-generator";

export interface GenesisV3GenerationResult {
  success: boolean;
  status: GenesisV3Status;
  score: number;
  artifacts: GenesisV3Artifact[];
  report: {
    totalFiles: number;
    backendFiles: number;
    prismaFiles: number;
    frontendFiles: number;
    dockerFiles: number;
    ciFiles: number;
    documentationFiles: number;
    registrationFiles: number;
    completionPercent: number;
    nextSteps: string[];
  };
  completedAt: string;
}

export class GenesisV3FirstSystemOrchestrator {
  constructor(
    readonly backend = new GenesisV3BackendGenerator(),
    readonly prisma = new GenesisV3PrismaGenerator(),
    readonly frontend = new GenesisV3FrontendGenerator(),
    readonly platform = new GenesisV3PlatformGenerator(),
  ) {}

  execute(
    specification: GenesisV3Specification,
  ): GenesisV3GenerationResult {
    const artifacts: GenesisV3Artifact[] = [];

    for (const domain of specification.domains) {
      artifacts.push(...this.backend.generate(domain));
    }

    artifacts.push(
      this.prisma.generate(
        specification.domains,
        specification.database.provider,
      ),
    );

    if (specification.frontend.enabled) {
      artifacts.push(
        ...this.frontend.generate(
          specification.frontend.title,
          specification.domains,
        ),
      );
    }

    artifacts.push(...this.platform.generate(specification));

    const duplicatePaths = artifacts
      .map((artifact) => artifact.relativePath)
      .filter(
        (path, index, all) => all.indexOf(path) !== index,
      );

    const integrityValid = artifacts.every(
      (artifact) =>
        artifact.hash.length === 64 &&
        artifact.content.trim().length > 0,
    );

    const requiredCoverage = [
      "backend",
      "prisma",
      "documentation",
      "registration",
    ].filter((kind) =>
      artifacts.some((artifact) => artifact.kind === kind),
    ).length;

    const completionPercent = Math.round(
      (requiredCoverage / 4) * 100,
    );

    const success =
      specification.domains.length > 0 &&
      duplicatePaths.length === 0 &&
      integrityValid &&
      completionPercent === 100;

    const status = success
      ? GenesisV3Status.READY
      : duplicatePaths.length > 0
        ? GenesisV3Status.BLOCKED
        : GenesisV3Status.DEGRADED;

    const score = Math.round(
      (
        completionPercent +
        (integrityValid ? 100 : 0) +
        Math.min(100, artifacts.length * 2)
      ) / 3,
    );

    const count = (kind: string) =>
      artifacts.filter((artifact) => artifact.kind === kind).length;

    return {
      success,
      status,
      score,
      artifacts,
      report: {
        totalFiles: artifacts.length,
        backendFiles: count("backend") + count("test"),
        prismaFiles: count("prisma"),
        frontendFiles: count("frontend"),
        dockerFiles: count("docker"),
        ciFiles: count("ci"),
        documentationFiles: count("documentation"),
        registrationFiles: count("registration"),
        completionPercent,
        nextSteps: [
          "materialize-workspace",
          "install-dependencies",
          "generate-prisma-client",
          "run-build-test-lint-smoke",
          "promote-release",
        ],
      },
      completedAt: new Date().toISOString(),
    };
  }
}
