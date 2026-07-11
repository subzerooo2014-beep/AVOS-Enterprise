import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenTemplateEngine,
} from "../../templates/codegen-template-engine";
import {
  CodeGenBlueprintExecutionContextFactory,
} from "./codegen-blueprint-execution-context";
import {
  CodeGenBlueprintBindingResolver,
} from "./codegen-blueprint-binding-resolver";
import {
  CodeGenBlueprintRuntimeRegistry,
} from "./codegen-blueprint-runtime-registry";
import {
  CodeGenBlueprintRuntimeStore,
} from "./codegen-blueprint-runtime-store";
import {
  CodeGenBlueprintRuntimeValidator,
} from "./codegen-blueprint-runtime-validator";
import {
  CodeGenBlueprintVariableMergeEngine,
} from "./codegen-blueprint-variable-merge-engine";
import {
  CodeGenTemplateArtifactMapper,
} from "./codegen-template-artifact-mapper";
import {
  CodeGenBlueprintRuntimeRequest,
  CodeGenBlueprintRuntimeStatus,
} from "./codegen-blueprint-runtime.contracts";

export class CodeGenBlueprintRuntimeExecutor {
  constructor(
    readonly registry =
      new CodeGenBlueprintRuntimeRegistry(),
    readonly templates =
      new CodeGenTemplateEngine(),
    readonly store =
      new CodeGenBlueprintRuntimeStore(),
    readonly validator =
      new CodeGenBlueprintRuntimeValidator(),
    readonly bindingResolver =
      new CodeGenBlueprintBindingResolver(),
    readonly variableMerge =
      new CodeGenBlueprintVariableMergeEngine(),
    readonly mapper =
      new CodeGenTemplateArtifactMapper(),
    readonly contextFactory =
      new CodeGenBlueprintExecutionContextFactory(),
  ) {}

  async execute(
    request:
      CodeGenBlueprintRuntimeRequest,
  ) {
    const execution =
      this.store.create(
        request,
      );

    try {
      this.store.setStatus(
        execution.executionId,
        CodeGenBlueprintRuntimeStatus.VALIDATING,
      );

      const blueprint =
        this.registry.get(
          request.blueprintKey,
        );

      const validation =
        this.validator.validate({
          blueprint,
          request,
          availableTemplateKeys:
            this.templates
              .list()
              .map(
                (template) =>
                  template.key,
              ),
          registeredBlueprintKeys:
            this.registry
              .list()
              .map(
                (item) =>
                  item.key,
              ),
        });

      for (
        const warning of
        validation.warnings
      ) {
        this.store.addWarning(
          execution.executionId,
          warning.message,
        );
      }

      if (!validation.valid) {
        for (
          const issue of
          validation.errors
        ) {
          this.store.addError(
            execution.executionId,
            issue.message,
          );
        }

        this.store.setStatus(
          execution.executionId,
          CodeGenBlueprintRuntimeStatus.FAILED,
        );

        return this.store.get(
          execution.executionId,
        );
      }

      this.store.setStatus(
        execution.executionId,
        CodeGenBlueprintRuntimeStatus.READY,
      );

      const context =
        this.contextFactory.create(
          this.store.get(
            execution.executionId,
          ),
          blueprint,
        );

      const bindings =
        this.bindingResolver.resolve(
          blueprint,
        );

      const artifacts:
        CodeGenArtifactDescriptor[] =
        [];

      this.store.mutate(
        execution.executionId,
        (mutable) => {
          mutable.templates =
            bindings.map(
              (binding) => ({
                templateKey:
                  binding.templateKey,
                order:
                  binding.order,
                variables:
                  structuredClone(
                    binding.variables,
                  ),
              }),
            );
        },
      );

      this.store.setStatus(
        execution.executionId,
        CodeGenBlueprintRuntimeStatus.RENDERING,
      );

      for (const binding of bindings) {
        const startedAt =
          new Date().toISOString();

        try {
          const variables =
            this.variableMerge.merge(
              binding.variables,
              context.variables,
            );

          const rendered =
            this.templates.render(
              binding.templateKey,
              {
                variables,
                strict:
                  context.strict,
              },
            );

          const artifact =
            this.mapper.map({
              blueprintKey:
                blueprint.key,
              rendered,
              order:
                binding.order,
            });

          artifacts.push(
            artifact,
          );

          this.store.mutate(
            execution.executionId,
            (mutable) => {
              const template =
                mutable.templates.find(
                  (item) =>
                    item.templateKey ===
                    binding.templateKey &&
                    item.order ===
                    binding.order,
                );

              if (!template) {
                throw new CodeGenValidationError(
                  `Runtime template execution record was not found: ${binding.templateKey}`,
                );
              }

              template.rendered =
                rendered;
              template.artifact =
                artifact;
              template.startedAt =
                startedAt;
              template.completedAt =
                new Date().toISOString();
            },
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : String(error);

          this.store.addError(
            execution.executionId,
            message,
          );

          this.store.mutate(
            execution.executionId,
            (mutable) => {
              const template =
                mutable.templates.find(
                  (item) =>
                    item.templateKey ===
                    binding.templateKey &&
                    item.order ===
                    binding.order,
                );

              if (template) {
                template.error =
                  message;
                template.startedAt =
                  startedAt;
                template.completedAt =
                  new Date().toISOString();
              }
            },
          );

          if (context.strict) {
            throw error;
          }
        }
      }

      this.store.setStatus(
        execution.executionId,
        CodeGenBlueprintRuntimeStatus.PLANNING,
      );

      this.store.mutate(
        execution.executionId,
        (mutable) => {
          mutable.artifacts =
            structuredClone(
              artifacts,
            );
        },
      );

      this.store.setStatus(
        execution.executionId,
        CodeGenBlueprintRuntimeStatus.EXECUTING,
      );

      this.store.setStatus(
        execution.executionId,
        CodeGenBlueprintRuntimeStatus.COMPLETED,
      );

      return this.store.get(
        execution.executionId,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      this.store.addError(
        execution.executionId,
        message,
      );

      this.store.setStatus(
        execution.executionId,
        CodeGenBlueprintRuntimeStatus.FAILED,
      );

      return this.store.get(
        execution.executionId,
      );
    }
  }
}
