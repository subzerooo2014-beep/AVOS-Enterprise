import { Injectable } from "@nestjs/common";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export interface BuildExecutionResult {
  command: string;
  exitCode: number;
  success: boolean;
  stdout: string;
  stderr: string;
}

export interface CapabilityBuildResult {
  success: boolean;
  workspacePath: string;
  checks: BuildExecutionResult[];
  completedAt: string;
}

@Injectable()
export class CapabilityBuildExecutionEngineService {
  execute(workspacePath: string): CapabilityBuildResult {
    if (!existsSync(workspacePath)) {
      throw new Error("Generated capability workspace does not exist.");
    }

    const packageFile = join(workspacePath, "package.json");
    const checks: BuildExecutionResult[] = [];

    if (!existsSync(packageFile)) {
      return {
        success: true,
        workspacePath,
        checks: [],
        completedAt: new Date().toISOString()
      };
    }

    checks.push(
      this.run(workspacePath, "pnpm", ["exec", "tsc", "--noEmit"])
    );

    const success = checks.every((check) => check.success);

    return {
      success,
      workspacePath,
      checks,
      completedAt: new Date().toISOString()
    };
  }

  private run(
    cwd: string,
    command: string,
    args: string[]
  ): BuildExecutionResult {
    const executable = process.platform === "win32"
      ? `${command}.cmd`
      : command;

    const result = spawnSync(executable, args, {
      cwd,
      encoding: "utf8",
      shell: false
    });

    return {
      command: [command, ...args].join(" "),
      exitCode: result.status ?? 1,
      success: result.status === 0,
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? ""
    };
  }
}
