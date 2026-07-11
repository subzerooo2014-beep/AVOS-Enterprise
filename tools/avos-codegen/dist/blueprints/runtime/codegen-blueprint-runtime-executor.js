"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintRuntimeExecutor = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_template_engine_1 = require("../../templates/codegen-template-engine");
const codegen_blueprint_execution_context_1 = require("./codegen-blueprint-execution-context");
const codegen_blueprint_binding_resolver_1 = require("./codegen-blueprint-binding-resolver");
const codegen_blueprint_runtime_registry_1 = require("./codegen-blueprint-runtime-registry");
const codegen_blueprint_runtime_store_1 = require("./codegen-blueprint-runtime-store");
const codegen_blueprint_runtime_validator_1 = require("./codegen-blueprint-runtime-validator");
const codegen_blueprint_variable_merge_engine_1 = require("./codegen-blueprint-variable-merge-engine");
const codegen_template_artifact_mapper_1 = require("./codegen-template-artifact-mapper");
const codegen_blueprint_runtime_contracts_1 = require("./codegen-blueprint-runtime.contracts");
class CodeGenBlueprintRuntimeExecutor {
    registry;
    templates;
    store;
    validator;
    bindingResolver;
    variableMerge;
    mapper;
    contextFactory;
    constructor(registry = new codegen_blueprint_runtime_registry_1.CodeGenBlueprintRuntimeRegistry(), templates = new codegen_template_engine_1.CodeGenTemplateEngine(), store = new codegen_blueprint_runtime_store_1.CodeGenBlueprintRuntimeStore(), validator = new codegen_blueprint_runtime_validator_1.CodeGenBlueprintRuntimeValidator(), bindingResolver = new codegen_blueprint_binding_resolver_1.CodeGenBlueprintBindingResolver(), variableMerge = new codegen_blueprint_variable_merge_engine_1.CodeGenBlueprintVariableMergeEngine(), mapper = new codegen_template_artifact_mapper_1.CodeGenTemplateArtifactMapper(), contextFactory = new codegen_blueprint_execution_context_1.CodeGenBlueprintExecutionContextFactory()) {
        this.registry = registry;
        this.templates = templates;
        this.store = store;
        this.validator = validator;
        this.bindingResolver = bindingResolver;
        this.variableMerge = variableMerge;
        this.mapper = mapper;
        this.contextFactory = contextFactory;
    }
    async execute(request) {
        const execution = this.store.create(request);
        try {
            this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.VALIDATING);
            const blueprint = this.registry.get(request.blueprintKey);
            const validation = this.validator.validate({
                blueprint,
                request,
                availableTemplateKeys: this.templates
                    .list()
                    .map((template) => template.key),
                registeredBlueprintKeys: this.registry
                    .list()
                    .map((item) => item.key),
            });
            for (const warning of validation.warnings) {
                this.store.addWarning(execution.executionId, warning.message);
            }
            if (!validation.valid) {
                for (const issue of validation.errors) {
                    this.store.addError(execution.executionId, issue.message);
                }
                this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.FAILED);
                return this.store.get(execution.executionId);
            }
            this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.READY);
            const context = this.contextFactory.create(this.store.get(execution.executionId), blueprint);
            const bindings = this.bindingResolver.resolve(blueprint);
            const artifacts = [];
            this.store.mutate(execution.executionId, (mutable) => {
                mutable.templates =
                    bindings.map((binding) => ({
                        templateKey: binding.templateKey,
                        order: binding.order,
                        variables: structuredClone(binding.variables),
                    }));
            });
            this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.RENDERING);
            for (const binding of bindings) {
                const startedAt = new Date().toISOString();
                try {
                    const variables = this.variableMerge.merge(binding.variables, context.variables);
                    const rendered = this.templates.render(binding.templateKey, {
                        variables,
                        strict: context.strict,
                    });
                    const artifact = this.mapper.map({
                        blueprintKey: blueprint.key,
                        rendered,
                        order: binding.order,
                    });
                    artifacts.push(artifact);
                    this.store.mutate(execution.executionId, (mutable) => {
                        const template = mutable.templates.find((item) => item.templateKey ===
                            binding.templateKey &&
                            item.order ===
                                binding.order);
                        if (!template) {
                            throw new codegen_errors_1.CodeGenValidationError(`Runtime template execution record was not found: ${binding.templateKey}`);
                        }
                        template.rendered =
                            rendered;
                        template.artifact =
                            artifact;
                        template.startedAt =
                            startedAt;
                        template.completedAt =
                            new Date().toISOString();
                    });
                }
                catch (error) {
                    const message = error instanceof Error
                        ? error.message
                        : String(error);
                    this.store.addError(execution.executionId, message);
                    this.store.mutate(execution.executionId, (mutable) => {
                        const template = mutable.templates.find((item) => item.templateKey ===
                            binding.templateKey &&
                            item.order ===
                                binding.order);
                        if (template) {
                            template.error =
                                message;
                            template.startedAt =
                                startedAt;
                            template.completedAt =
                                new Date().toISOString();
                        }
                    });
                    if (context.strict) {
                        throw error;
                    }
                }
            }
            this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.PLANNING);
            this.store.mutate(execution.executionId, (mutable) => {
                mutable.artifacts =
                    structuredClone(artifacts);
            });
            this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.EXECUTING);
            this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.COMPLETED);
            return this.store.get(execution.executionId);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            this.store.addError(execution.executionId, message);
            this.store.setStatus(execution.executionId, codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.FAILED);
            return this.store.get(execution.executionId);
        }
    }
}
exports.CodeGenBlueprintRuntimeExecutor = CodeGenBlueprintRuntimeExecutor;
//# sourceMappingURL=codegen-blueprint-runtime-executor.js.map