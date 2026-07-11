"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionScheduleSerializer = void 0;
class CodeGenExecutionScheduleSerializer {
    serialize(schedule, pretty = true) {
        return JSON.stringify(schedule, null, pretty
            ? 2
            : undefined);
    }
    deserialize(value) {
        return JSON.parse(value);
    }
}
exports.CodeGenExecutionScheduleSerializer = CodeGenExecutionScheduleSerializer;
//# sourceMappingURL=codegen-execution-schedule-serializer.js.map