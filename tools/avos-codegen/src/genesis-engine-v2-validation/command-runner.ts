import { spawn } from "node:child_process";
import {
  ValidationGateDefinition,
  ValidationGateResult,
  ValidationGateStatus,
} from "./contracts";

export class ValidationCommandRunner {
  run(
    cwd: string,
    gate: ValidationGateDefinition,
  ): Promise<ValidationGateResult> {
    return new Promise((resolve) => {
      const startedAt = Date.now();
      const child = spawn(
        process.platform === "win32" ? "cmd.exe" : "sh",
        process.platform === "win32"
          ? ["/d", "/s", "/c", gate.command]
          : ["-lc", gate.command],
        {
          cwd,
          windowsHide: true,
          env: process.env,
        },
      );

      let output = "";
      let settled = false;

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        child.kill();

        resolve({
          key: gate.key,
          status: ValidationGateStatus.FAILED,
          required: gate.required,
          exitCode: null,
          durationMs: Date.now() - startedAt,
          output: `${output}\nValidation gate timed out.`,
          score: 0,
        });
      }, gate.timeoutMs);

      child.stdout.on("data", (chunk) => {
        output += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        output += chunk.toString();
      });

      child.on("close", (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);

        const passed = code === 0;

        resolve({
          key: gate.key,
          status: passed
            ? ValidationGateStatus.PASSED
            : ValidationGateStatus.FAILED,
          required: gate.required,
          exitCode: code,
          durationMs: Date.now() - startedAt,
          output,
          score: passed ? 100 : 0,
        });
      });

      child.on("error", (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);

        resolve({
          key: gate.key,
          status: ValidationGateStatus.FAILED,
          required: gate.required,
          exitCode: null,
          durationMs: Date.now() - startedAt,
          output: error.message,
          score: 0,
        });
      });
    });
  }
}
