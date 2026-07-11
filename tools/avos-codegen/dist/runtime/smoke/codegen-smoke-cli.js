"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCodeGenSmoke = runCodeGenSmoke;
const node_path_1 = require("node:path");
const codegen_end_to_end_smoke_runner_1 = require("./codegen-end-to-end-smoke-runner");
async function runCodeGenSmoke(codegenRoot = process.cwd()) {
    const runner = new codegen_end_to_end_smoke_runner_1.CodeGenEndToEndSmokeRunner();
    const result = await runner.run((0, node_path_1.resolve)(codegenRoot));
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.success) {
        process.exitCode = 1;
    }
}
//# sourceMappingURL=codegen-smoke-cli.js.map