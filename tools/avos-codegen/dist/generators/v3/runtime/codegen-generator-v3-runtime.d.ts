import { CodeGenGeneratorV3Request, CodeGenGeneratorV3Result } from "../contracts/codegen-generator-v3.contracts";
import { CodeGenGeneratorV3NamingEngine } from "../naming/codegen-generator-v3-naming-engine";
import { CodeGenGeneratorV3ModuleRenderer } from "../module/codegen-generator-v3-module-renderer";
import { CodeGenGeneratorV3DtoRenderer } from "../module/codegen-generator-v3-dto-renderer";
import { CodeGenGeneratorV3PrismaRenderer } from "../prisma/codegen-generator-v3-prisma-renderer";
import { CodeGenGeneratorV3TestRenderer } from "../tests/codegen-generator-v3-test-renderer";
import { CodeGenGeneratorV3ManifestRenderer } from "../module/codegen-generator-v3-manifest-renderer";
export declare class CodeGenGeneratorV3Runtime {
    readonly naming: CodeGenGeneratorV3NamingEngine;
    readonly modules: CodeGenGeneratorV3ModuleRenderer;
    readonly dtos: CodeGenGeneratorV3DtoRenderer;
    readonly prisma: CodeGenGeneratorV3PrismaRenderer;
    readonly tests: CodeGenGeneratorV3TestRenderer;
    readonly manifests: CodeGenGeneratorV3ManifestRenderer;
    constructor(naming?: CodeGenGeneratorV3NamingEngine, modules?: CodeGenGeneratorV3ModuleRenderer, dtos?: CodeGenGeneratorV3DtoRenderer, prisma?: CodeGenGeneratorV3PrismaRenderer, tests?: CodeGenGeneratorV3TestRenderer, manifests?: CodeGenGeneratorV3ManifestRenderer);
    execute(request: CodeGenGeneratorV3Request): CodeGenGeneratorV3Result;
    private validateRequest;
}
//# sourceMappingURL=codegen-generator-v3-runtime.d.ts.map