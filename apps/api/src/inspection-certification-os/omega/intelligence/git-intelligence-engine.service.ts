import { Injectable } from "@nestjs/common";
import { InspectionCommandRunnerService } from "../../shared/inspection-command-runner.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class GitIntelligenceEngineService {
  constructor(private readonly runner: InspectionCommandRunnerService) {}

  async inspect(repositoryRoot: string): Promise<OmegaIntelligenceSection> {
    const branch = await this.runner.run(
      "git",
      ["branch", "--show-current"],
      repositoryRoot,
      30000,
    );

    const commits = await this.runner.run(
      "git",
      ["rev-list", "--count", "HEAD"],
      repositoryRoot,
      30000,
    );

    const status = await this.runner.run(
      "git",
      ["status", "--porcelain"],
      repositoryRoot,
      30000,
    );

    const changedFiles = status.stdout
      .split(/\r?\n/)
      .filter((line: string) => line.trim().length > 0).length;

    const healthy =
      branch.exitCode === 0 &&
      commits.exitCode === 0 &&
      status.exitCode === 0;

    return {
      name: "git-intelligence",
      status: healthy ? "healthy" : "attention",
      score: healthy ? 100 : 60,
      findings: [],
      metrics: {
        branch: branch.stdout.trim(),
        commitCount: Number(commits.stdout.trim()) || 0,
        changedFiles,
        repositoryHealthy: healthy,
      },
    };
  }
}


