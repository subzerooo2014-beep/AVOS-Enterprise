import { randomUUID } from "node:crypto";
import {
  V4FrontendArtifact,
  V4FrontendInput,
  V4FrontendStatus,
} from "./contracts";
import { V4ApiClientGenerator } from "./api-client-generator";
import { V4FormGenerator } from "./form-generator";
import { V4TableGenerator } from "./table-generator";
import { V4PageGenerator } from "./page-generator";
import { V4ShellGenerator } from "./shell-generator";
import { V4FrontendRbacGenerator } from "./rbac-generator";
import { V4FrontendTestGenerator } from "./test-generator";
import { frontendKebab } from "./name-utils";

export interface V4FrontendGenerationResult {
  success: boolean;
  status: V4FrontendStatus;
  score: number;
  artifacts: V4FrontendArtifact[];
  pages: number;
  forms: number;
  tables: number;
  apiClients: number;
  states: number;
  tests: number;
  rbacArtifacts: number;
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

export class GenesisV4ProductionFrontendOrchestrator {
  constructor(
    readonly apiClientGenerator = new V4ApiClientGenerator(),
    readonly formGenerator = new V4FormGenerator(),
    readonly tableGenerator = new V4TableGenerator(),
    readonly pageGenerator = new V4PageGenerator(),
    readonly shellGenerator = new V4ShellGenerator(),
    readonly rbacGenerator = new V4FrontendRbacGenerator(),
    readonly testGenerator = new V4FrontendTestGenerator(),
  ) {}

  execute(input: V4FrontendInput): V4FrontendGenerationResult {
    const artifacts: V4FrontendArtifact[] = [
      ...this.shellGenerator.generate(input),
    ];

    for (const domain of input.domains) {
      artifacts.push(
        this.apiClientGenerator.generate(domain),
        this.formGenerator.generate(domain),
        this.tableGenerator.generate(
          domain,
          input.enableSearch !== false,
        ),
        ...this.pageGenerator.generate(domain),
        ...this.testGenerator.generate(domain),
        {
          relativePath: `apps/web/components/${frontendKebab(domain.key)}/index.ts`,
          kind: "index",
          content: `export * from "./${frontendKebab(domain.key)}-form";
export * from "./${frontendKebab(domain.key)}-table";
`,
          metadata: { domain: domain.key },
        },
      );
    }

    if (input.enableRbac !== false) {
      artifacts.push(this.rbacGenerator.generate(input.domains));
    }

    const duplicatePaths = artifacts
      .map((artifact) => artifact.relativePath)
      .filter((item, index, all) => all.indexOf(item) !== index);

    const expectedMinimum = 3 + input.domains.length * 8;
    const coverage = expectedMinimum === 0
      ? 0
      : Math.min(
          100,
          Math.round((artifacts.length / expectedMinimum) * 100),
        );

    const featureScore = [
      input.enableRbac !== false,
      input.enableDashboard !== false,
      input.enableSearch !== false,
      input.enableResponsiveShell !== false,
    ].filter(Boolean).length * 25;

    const score = Math.round((coverage + featureScore + 100) / 3);

    const success =
      input.domains.length > 0 &&
      duplicatePaths.length === 0 &&
      artifacts.length >= expectedMinimum &&
      score >= 80;

    const status = success
      ? V4FrontendStatus.READY
      : score >= 60
        ? V4FrontendStatus.DEGRADED
        : V4FrontendStatus.BLOCKED;

    const count = (kind: V4FrontendArtifact["kind"]) =>
      artifacts.filter((artifact) => artifact.kind === kind).length;

    return {
      success,
      status,
      score,
      artifacts,
      pages: count("page") + count("dashboard"),
      forms: count("form"),
      tables: count("table"),
      apiClients: count("api-client"),
      states: count("state"),
      tests: count("test"),
      rbacArtifacts: count("rbac"),
      enterpriseBrainPayload: {
        type: "genesis-v4-production-frontend",
        systemKey: input.systemKey,
        systemName: input.systemName,
        domains: input.domains.map((domain) => domain.key),
        capabilities: [
          "nextjs",
          "dashboard",
          "crud",
          "forms",
          "tables",
          "search",
          "rbac-ui",
          "responsive-shell",
        ],
        artifactCount: artifacts.length,
      },
      evolutionCenterPayload: {
        type: "genesis-v4-frontend-baseline",
        systemKey: input.systemKey,
        score,
        artifacts: artifacts.length,
        pages: count("page") + count("dashboard"),
        forms: count("form"),
        tables: count("table"),
        tests: count("test"),
      },
      evidence: [
        {
          id: randomUUID(),
          action: "genesis-v4.production-frontend.completed",
          message: `Production frontend generated with ${artifacts.length} artifacts.`,
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}
