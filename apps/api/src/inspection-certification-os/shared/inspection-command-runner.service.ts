import { Injectable } from "@nestjs/common";
import { spawn } from "node:child_process";

export interface CommandExecutionResult {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number;
  readonly timedOut: boolean;
}

@Injectable()
export class InspectionCommandRunnerService {
  run(
    command: string,
    args: readonly string[],
    cwd: string,
    timeoutMs = 120_000,
  ): Promise<CommandExecutionResult> {
    return new Promise((resolve) => {
      const startedAt = Date.now();
      let stdout = "";
      let stderr = "";
      let timedOut = false;
      let settled = false;

      const child = spawn(command, [...args], {
        cwd,
        shell: true,
        env: process.env,
      });

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill();
      }, timeoutMs);

      child.stdout?.on("data", (chunk: Buffer | string) => {
        stdout += chunk.toString();
      });

      child.stderr?.on("data", (chunk: Buffer | string) => {
        stderr += chunk.toString();
      });

      const finish = (exitCode: number): void => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);

        resolve({
          command,
          args,
          cwd,
          exitCode,
          stdout,
          stderr,
          durationMs: Date.now() - startedAt,
          timedOut,
        });
      };

      child.on("error", (error) => {
        stderr += error.message;
        finish(1);
      });

      child.on("close", (exitCode) => {
        finish(exitCode ?? 1);
      });
    });
  }
}
