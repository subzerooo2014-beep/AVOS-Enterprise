import { Injectable } from "@nestjs/common";
import { spawnSync } from "child_process";
import { FactoryCommandResult } from "../contracts/materialization.contracts";

@Injectable()
export class FactoryCommandRunnerService {
  run(command: string, cwd: string): FactoryCommandResult {
    const startedAt = new Date().toISOString();
    const startedMs = Date.now();

    const result = spawnSync(command, {
      cwd,
      shell: true,
      encoding: "utf8",
      env: process.env,
    });

    const completedAt = new Date().toISOString();

    return {
      command,
      cwd,
      exitCode: result.status ?? 1,
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
      startedAt,
      completedAt,
      durationMs: Date.now() - startedMs,
    };
  }
}
