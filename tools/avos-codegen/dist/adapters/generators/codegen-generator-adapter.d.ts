import { CodeGenGeneratorEngine } from "../../generators/codegen-generator-engine";
import { CodeGenGeneratorAdapterRequest, CodeGenGeneratorAdapterResult } from "./codegen-generator-adapter.contracts";
export declare class CodeGenGeneratorAdapter {
    readonly engine: CodeGenGeneratorEngine;
    constructor(engine?: CodeGenGeneratorEngine);
    execute(request: CodeGenGeneratorAdapterRequest): Promise<CodeGenGeneratorAdapterResult>;
    private resolveArtifactType;
}
//# sourceMappingURL=codegen-generator-adapter.d.ts.map