import { Injectable } from "@nestjs/common";
import { InspectionCommandRunnerService } from "../../shared/inspection-command-runner.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class PerformanceIntelligenceEngineService {
  constructor(private readonly runner: InspectionCommandRunnerService) {}

  async inspect(apiRoot: string): Promise<OmegaIntelligenceSection> {
    const result = await this.runner.run(
      "pnpm",
      ["exec", "tsc", "--noEmit"],
      apiRoot,
      240000,
    );

    const healthy = result.exitCode === 0 && !result.timedOut;

    return {
      name: "performance-intelligence",
      status: healthy ? "healthy" : "critical",
      score: healthy ? 100 : 0,
      findings: [],
      metrics: {
        command: "pnpm exec tsc --noEmit",
        durationMs: result.durationMs,
        exitCode: result.exitCode,
        timedOut: result.timedOut,
      },
    };
  }
}

