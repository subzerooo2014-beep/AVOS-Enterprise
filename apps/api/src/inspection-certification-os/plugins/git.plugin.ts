import { Injectable } from "@nestjs/common";
import {
  InspectionExecutionContext,
  InspectionPlugin,
  InspectionPluginResult,
} from "../inspection-plugin.types";
import { InspectionCommandRunnerService } from "../shared/inspection-command-runner.service";

@Injectable()
export class GitInspectionPlugin implements InspectionPlugin {
  readonly id = "ic.plugin.git";
  readonly name = "Git Repository Inspection";
  readonly version = "1.0.0";
  readonly category = "source-control";
  readonly severity = "recommended" as const;
  readonly priority = 70;
  readonly timeoutMs = 30_000;
  readonly enabled = true;
  readonly dependencies = ["ic.plugin.repository-structure"] as const;

  constructor(private readonly runner: InspectionCommandRunnerService) {}

  async inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult> {
    const status = await this.runner.run(
      "git",
      ["status", "--porcelain"],
      context.repositoryRoot,
      this.timeoutMs,
    );

    const branch = await this.runner.run(
      "git",
      ["branch", "--show-current"],
      context.repositoryRoot,
      this.timeoutMs,
    );

    const changedFiles = status.stdout
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);

    const validRepository = status.exitCode === 0 && branch.exitCode === 0;

    return {
      pluginId: this.id,
      pluginVersion: this.version,
      ruleId: this.id,
      name: this.name,
      category: this.category,
      severity: this.severity,
      status: !validRepository
        ? "fail"
        : changedFiles.length === 0
          ? "pass"
          : "warn",
      weight: 10,
      durationMs: status.durationMs + branch.durationMs,
      message: !validRepository
        ? "Git repository inspection failed."
        : changedFiles.length === 0
          ? "Git working tree is clean."
          : `Git working tree contains ${changedFiles.length} changed files.`,
      evidence: [
        { key: "branch", value: branch.stdout.trim() },
        { key: "changedFiles", value: changedFiles.length },
        { key: "repositoryValid", value: validRepository },
      ],
      metrics: [{ name: "changedFiles", value: changedFiles.length }],
      recommendations:
        changedFiles.length === 0
          ? []
          : [
              {
                title: "Review uncommitted changes",
                description:
                  "Review, commit, or intentionally retain the current working-tree changes.",
                priority: "medium",
              },
            ],
      files: changedFiles.slice(0, 100),
    };
  }
}
