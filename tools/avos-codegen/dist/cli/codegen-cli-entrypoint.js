#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codegen_cli_runtime_1 = require("./runtime/codegen-cli-runtime");
async function main() {
    const runtime = new codegen_cli_runtime_1.CodeGenCliRuntime();
    const output = await runtime.run(process.argv.slice(2), process.cwd());
    const json = process.argv.includes("--json");
    process.stdout.write(`${runtime.formatter.format(output, json)}\n`);
    if (!output.success) {
        process.exitCode = 1;
    }
}
void main();
//# sourceMappingURL=codegen-cli-entrypoint.js.map