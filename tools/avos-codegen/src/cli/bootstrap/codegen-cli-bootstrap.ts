import {
  resolve,
} from "node:path";
import {
  CodeGenBlueprintBootstrapService,
} from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";
import {
  CodeGenUnifiedGenerationService,
} from "../../generation/codegen-unified-generation.service";

export interface CodeGenCliBootstrapRuntime {
  codegenRoot: string;
  bootstrap:
    CodeGenBlueprintBootstrapService;
  generation:
    CodeGenUnifiedGenerationService;
}

export function createCodeGenCliBootstrap(
  codegenRoot =
    process.cwd(),
): CodeGenCliBootstrapRuntime {
  return {
    codegenRoot:
      resolve(codegenRoot),
    bootstrap:
      new CodeGenBlueprintBootstrapService(),
    generation:
      new CodeGenUnifiedGenerationService(),
  };
}
