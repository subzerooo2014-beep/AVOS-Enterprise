"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationCliService = void 0;
const codegen_validation_runtime_1 = require("../runtime/codegen-validation-runtime");
class CodeGenValidationCliService {
    runtime;
    constructor(runtime = new codegen_validation_runtime_1.CodeGenValidationRuntime()) {
        this.runtime = runtime;
    }
    async validate(context) {
        const result = await this.runtime.execute(context);
        return JSON.stringify(result, null, 2);
    }
}
exports.CodeGenValidationCliService = CodeGenValidationCliService;
//# sourceMappingURL=codegen-validation-cli.service.js.map