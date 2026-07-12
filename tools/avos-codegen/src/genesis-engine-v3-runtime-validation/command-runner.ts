import { spawn } from "node:child_process";
import {
  GenesisV3RuntimeCommand,
  GenesisV3RuntimeCommandResult,
  GenesisV3RuntimeStageStatus,
} from "./contracts";

export class GenesisV3RuntimeCommandRunner {
  run(
    cwd: string,
    command: GenesisV3RuntimeCommand,
  ): Promise<GenesisV3RuntimeCommandResult> {
    return new Promise((resolve) => {
      const startedAt = Date.now();
      const shell = process.platform === "win32" ? "cmd.exe" : "sh";
      const args =
        process.platform === "win32"
          ? ["/d", "/s", "/c", command.command]
          : ["-lc", command.command];

      const child = spawn(shell, args, {
        cwd,
        windowsHide: true,
        env: process.env,
      });

      let output = "";
      let settled = false;

      const finish = (
        status: GenesisV3RuntimeStageStatus,
        exitCode: number | null,
        message?: string,
      ) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);

        resolve({
          key: command.key,
          command: command.command,
          required: command.required,
          status,
          exitCode,
          durationMs: Date.now() - startedAt,
          output: message ? `${output}\n${message}` : output,
          score:
            status === GenesisV3RuntimeStageStatus.PASSED ? 100 : 0,
        });
      };

      const timer = setTimeout(() => {
        child.kill();
        finish(
          GenesisV3RuntimeStageStatus.FAILED,
          null,
          "Command timed out.",
        );
      }, command.timeoutMs);

      child.stdout.on("data", (chunk) => {
        output += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        output += chunk.toString();
      });

      child.on("error", (error) => {
        finish(
          GenesisV3RuntimeStageStatus.FAILED,
          null,
          error.message,
        );
      });

      child.on("close", (code) => {
        finish(
          code === 0
            ? GenesisV3RuntimeStageStatus.PASSED
            : GenesisV3RuntimeStageStatus.FAILED,
          code,
        );
      });
    });
  }
}
