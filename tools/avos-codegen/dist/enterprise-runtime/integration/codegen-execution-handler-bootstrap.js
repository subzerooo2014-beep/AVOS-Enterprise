"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDefaultExecutionHandlers = registerDefaultExecutionHandlers;
const codegen_default_execution_task_handler_1 = require("../execution/runtime/codegen-default-execution-task-handler");
const codegen_execution_task_contracts_1 = require("../execution/contracts/codegen-execution-task.contracts");
function registerDefaultExecutionHandlers(registry) {
    const types = [
        codegen_execution_task_contracts_1.CodeGenExecutionTaskType.GENERATE,
        codegen_execution_task_contracts_1.CodeGenExecutionTaskType.VALIDATE,
        codegen_execution_task_contracts_1.CodeGenExecutionTaskType.WRITE,
        codegen_execution_task_contracts_1.CodeGenExecutionTaskType.TRANSFORM,
        codegen_execution_task_contracts_1.CodeGenExecutionTaskType.CUSTOM,
    ];
    for (const type of types) {
        registry.register(new codegen_default_execution_task_handler_1.CodeGenDefaultExecutionTaskHandler(type), true);
    }
    return registry;
}
//# sourceMappingURL=codegen-execution-handler-bootstrap.js.map