"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionPlanSerializer = void 0;
class CodeGenExecutionPlanSerializer {
    serialize(plan, pretty = true) {
        return JSON.stringify(plan, null, pretty
            ? 2
            : undefined);
    }
    deserialize(value) {
        return JSON.parse(value);
    }
}
exports.CodeGenExecutionPlanSerializer = CodeGenExecutionPlanSerializer;
//# sourceMappingURL=codegen-execution-plan-serializer.js.map