import {
  CodeGenBlueprintExecutionOrchestrator,
} from "../../blueprints/runtime/codegen-blueprint-execution-orchestrator";
import {
  CodeGenBlueprintRuntimeExecutor,
} from "../../blueprints/runtime/codegen-blueprint-runtime-executor";
import {
  CodeGenBlueprintRuntimeRegistry,
} from "../../blueprints/runtime/codegen-blueprint-runtime-registry";
import {
  CodeGenTemplateEngine,
} from "../../templates/codegen-template-engine";
import {
  CodeGenBlueprintBootstrapService,
} from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";

export interface CodeGenGenerationBootstrapRuntime {
  bootstrap:
    CodeGenBlueprintBootstrapService;
  blueprintRegistry:
    CodeGenBlueprintRuntimeRegistry;
  templateEngine:
    CodeGenTemplateEngine;
  executor:
    CodeGenBlueprintRuntimeExecutor;
  orchestrator:
    CodeGenBlueprintExecutionOrchestrator;
}

export function createCodeGenGenerationRuntime():
  CodeGenGenerationBootstrapRuntime {
  const blueprintRegistry =
    new CodeGenBlueprintRuntimeRegistry();

  const templateEngine =
    new CodeGenTemplateEngine();

  const bootstrap =
    new CodeGenBlueprintBootstrapService(
      blueprintRegistry,
      templateEngine,
    );

  const executor =
    new CodeGenBlueprintRuntimeExecutor(
      blueprintRegistry,
      templateEngine,
    );

  const orchestrator =
    new CodeGenBlueprintExecutionOrchestrator(
      executor,
    );

  return {
    bootstrap,
    blueprintRegistry,
    templateEngine,
    executor,
    orchestrator,
  };
}
