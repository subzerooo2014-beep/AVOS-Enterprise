"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBuildOrchestrator = void 0;
const node_child_process_1 = require("node:child_process");
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenBuildOrchestrator {
    run(request) {
        if (!request.command.trim()) {
            throw new codegen_errors_1.CodeGenValidationError("Build command is required");
        }
        return new Promise((resolvePromise, reject) => {
            const startedAt = new Date().toISOString();
            const child = (0, node_child_process_1.spawn)(request.command, request.args, {
                cwd: request.cwd,
                env: {
                    ...process.env,
                    ...request.environment,
                },
                shell: true,
            });
            let stdout = "";
            let stderr = "";
            child.stdout.on("data", (chunk) => {
                stdout += chunk.toString();
            });
            child.stderr.on("data", (chunk) => {
                stderr += chunk.toString();
            });
            child.on("error", (error) => {
                reject(error);
            });
            child.on("close", (code) => {
                const exitCode = code ?? 1;
                resolvePromise({
                    success: exitCode === 0,
                    exitCode,
                    command: [
                        request.command,
                        ...request.args,
                    ].join(" "),
                    stdout,
                    stderr,
                    startedAt,
                    completedAt: new Date().toISOString(),
                });
            });
        });
    }
}
exports.CodeGenBuildOrchestrator = CodeGenBuildOrchestrator;
//# sourceMappingURL=codegen-build-orchestrator.js.map