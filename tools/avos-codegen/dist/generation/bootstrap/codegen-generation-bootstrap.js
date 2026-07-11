"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodeGenGenerationRuntime = createCodeGenGenerationRuntime;
const codegen_blueprint_execution_orchestrator_1 = require("../../blueprints/runtime/codegen-blueprint-execution-orchestrator");
const codegen_blueprint_runtime_executor_1 = require("../../blueprints/runtime/codegen-blueprint-runtime-executor");
const codegen_blueprint_runtime_registry_1 = require("../../blueprints/runtime/codegen-blueprint-runtime-registry");
const codegen_template_engine_1 = require("../../templates/codegen-template-engine");
const codegen_blueprint_bootstrap_service_1 = require("../../blueprints/bootstrap/codegen-blueprint-bootstrap.service");
function createCodeGenGenerationRuntime() {
    const blueprintRegistry = new codegen_blueprint_runtime_registry_1.CodeGenBlueprintRuntimeRegistry();
    const templateEngine = new codegen_template_engine_1.CodeGenTemplateEngine();
    const bootstrap = new codegen_blueprint_bootstrap_service_1.CodeGenBlueprintBootstrapService(blueprintRegistry, templateEngine);
    const executor = new codegen_blueprint_runtime_executor_1.CodeGenBlueprintRuntimeExecutor(blueprintRegistry, templateEngine);
    const orchestrator = new codegen_blueprint_execution_orchestrator_1.CodeGenBlueprintExecutionOrchestrator(executor);
    return {
        bootstrap,
        blueprintRegistry,
        templateEngine,
        executor,
        orchestrator,
    };
}
//# sourceMappingURL=codegen-generation-bootstrap.js.map