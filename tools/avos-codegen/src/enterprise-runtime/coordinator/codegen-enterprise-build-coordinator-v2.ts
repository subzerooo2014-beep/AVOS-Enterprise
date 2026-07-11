import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenArtifactGraphBuilderV2,
} from "../graph-v2/codegen-artifact-graph-builder-v2";
import {
  CodeGenEnterpriseRuntimeDiagnostics,
} from "../diagnostics/codegen-enterprise-runtime-diagnostics";
import {
  CodeGenEnterpriseRuntimeHealthMonitor,
} from "../health/codegen-enterprise-runtime-health-monitor";
import {
  CodeGenEnterpriseRuntimeLogger,
  CodeGenRuntimeLogLevel,
} from "../logging/codegen-enterprise-runtime-logger";
import {
  CodeGenWorkspaceScanner,
} from "../workspace/codegen-workspace-scanner";
import {
  CodeGenWorkspaceSynchronizer,
} from "../workspace/codegen-workspace-synchronizer";

export class CodeGenEnterpriseBuildCoordinatorV2 {
  constructor(
    readonly graph =
      new CodeGenArtifactGraphBuilderV2(),
    readonly diagnostics =
      new CodeGenEnterpriseRuntimeDiagnostics(),
    readonly health =
      new CodeGenEnterpriseRuntimeHealthMonitor(),
    readonly logger =
      new CodeGenEnterpriseRuntimeLogger(),
    readonly scanner =
      new CodeGenWorkspaceScanner(),
    readonly synchronizer =
      new CodeGenWorkspaceSynchronizer(),
  ) {}

  async execute(
    input: {
      workspaceRoot: string;
      targetRoot: string;
      artifacts:
        readonly CodeGenArtifactDescriptor[];
      dryRun: boolean;
      scanWorkspace?: boolean;
    },
  ) {
    this.logger.log(
      CodeGenRuntimeLogLevel.INFORMATIONAL,
      "Enterprise build coordination started",
      {
        artifacts:
          input.artifacts.length,
        dryRun:
          input.dryRun,
      },
    );

    const graph =
      this.graph.build(
        input.artifacts,
      );

    const workspace =
      input.scanWorkspace
        ? await this.scanner.scan(
            input.workspaceRoot,
          )
        : undefined;

    const diagnostics =
      this.diagnostics.analyze({
        graph,
        ...(workspace
          ? {
              workspace,
            }
          : {}),
      });

    const health =
      this.health.evaluate(
        diagnostics,
      );

    if (
      health.status ===
      "unhealthy"
    ) {
      this.logger.log(
        CodeGenRuntimeLogLevel.ERROR,
        "Enterprise build coordination blocked",
        {
          critical:
            health.critical,
          errors:
            health.errors,
        },
      );

      return {
        success: false,
        graph,
        workspace,
        diagnostics,
        health,
        synchronization:
          undefined,
        logs:
          this.logger.list(),
      };
    }

    const synchronization =
      await this.synchronizer.synchronize(
        input.targetRoot,
        input.artifacts,
        input.dryRun,
      );

    const success =
      synchronization.failed.length ===
      0;

    this.logger.log(
      success
        ? CodeGenRuntimeLogLevel.INFORMATIONAL
        : CodeGenRuntimeLogLevel.WARNING,
      success
        ? "Enterprise build coordination completed"
        : "Enterprise build coordination completed with failures",
      {
        written:
          synchronization.written.length,
        unchanged:
          synchronization.unchanged.length,
        failed:
          synchronization.failed.length,
      },
    );

    return {
      success,
      graph,
      workspace,
      diagnostics,
      health,
      synchronization,
      logs:
        this.logger.list(),
    };
  }
}
