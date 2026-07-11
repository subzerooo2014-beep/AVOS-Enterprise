"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseRuntimeCliBridge = void 0;
const codegen_enterprise_end_to_end_runtime_1 = require("../e2e/codegen-enterprise-end-to-end-runtime");
class CodeGenEnterpriseRuntimeCliBridge {
    runtime;
    constructor(runtime = new codegen_enterprise_end_to_end_runtime_1.CodeGenEnterpriseEndToEndRuntime()) {
        this.runtime = runtime;
    }
    async execute(request) {
        const result = await this.runtime.execute(request);
        return JSON.stringify(result, null, 2);
    }
}
exports.CodeGenEnterpriseRuntimeCliBridge = CodeGenEnterpriseRuntimeCliBridge;
//# sourceMappingURL=codegen-enterprise-runtime-cli-bridge.js.map