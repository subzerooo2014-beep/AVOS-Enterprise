import {
  spawn,
} from "node:child_process";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";

export interface CodeGenBuildRequest {
  cwd: string;
  command: string;
  args: string[];
  environment?: NodeJS.ProcessEnv;
}

export interface CodeGenBuildResult {
  success: boolean;
  exitCode: number;
  command: string;
  stdout: string;
  stderr: string;
  startedAt: string;
  completedAt: string;
}

export class CodeGenBuildOrchestrator {
  run(
    request: CodeGenBuildRequest,
  ): Promise<CodeGenBuildResult> {
    if (!request.command.trim()) {
      throw new CodeGenValidationError(
        "Build command is required",
      );
    }

    return new Promise(
      (resolvePromise, reject) => {
        const startedAt =
          new Date().toISOString();

        const child = spawn(
          request.command,
          request.args,
          {
            cwd: request.cwd,
            env: {
              ...process.env,
              ...request.environment,
            },
            shell: true,
          },
        );

        let stdout = "";
        let stderr = "";

        child.stdout.on(
          "data",
          (chunk: Buffer) => {
            stdout += chunk.toString();
          },
        );

        child.stderr.on(
          "data",
          (chunk: Buffer) => {
            stderr += chunk.toString();
          },
        );

        child.on(
          "error",
          (error) => {
            reject(error);
          },
        );

        child.on(
          "close",
          (code) => {
            const exitCode = code ?? 1;

            resolvePromise({
              success: exitCode === 0,
              exitCode,
              command:
                [
                  request.command,
                  ...request.args,
                ].join(" "),
              stdout,
              stderr,
              startedAt,
              completedAt:
                new Date().toISOString(),
            });
          },
        );
      },
    );
  }
}
