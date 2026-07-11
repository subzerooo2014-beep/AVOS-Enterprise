import { CodeGenFileSystemEngine } from "../filesystem/codegen-filesystem-engine";
import { CodeGenWriteFileResult } from "../filesystem/codegen-filesystem.contracts";
import { CodeGenGeneratorContext, CodeGenGeneratorResult } from "./codegen-generator.contracts";
import { CodeGenGeneratorRegistry } from "./codegen-generator-registry";
export interface ExecuteGeneratorResult {
    result: CodeGenGeneratorResult;
    writes: CodeGenWriteFileResult[];
}
export declare class CodeGenGeneratorEngine {
    readonly registry: CodeGenGeneratorRegistry;
    readonly fileSystem: CodeGenFileSystemEngine;
    constructor(registry?: CodeGenGeneratorRegistry, fileSystem?: CodeGenFileSystemEngine);
    execute(key: string, context: CodeGenGeneratorContext): Promise<ExecuteGeneratorResult>;
}
//# sourceMappingURL=codegen-generator-engine.d.ts.map