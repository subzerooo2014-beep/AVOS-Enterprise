import { CodeGenMetadata, CodeGenVersion } from "../core/codegen.contracts";
import { CodeGenCompiledTemplate, CodeGenRenderedTemplate, CodeGenTemplateDefinition, CodeGenTemplateRenderContext, CodeGenTemplateType, CodeGenTemplateVariable } from "./codegen-template.contracts";
import { CodeGenTemplateCache } from "./cache/codegen-template-cache";
import { CodeGenTemplateCatalog } from "./catalog/codegen-template-catalog";
import { CodeGenTemplateCompiler } from "./compiler/codegen-template-compiler";
import { CodeGenTemplateRenderer } from "./compiler/codegen-template-renderer";
import { CodeGenTemplateLoader } from "./loading/codegen-template-loader";
export interface CreateTemplateInput {
    key: string;
    name: string;
    description?: string;
    type?: CodeGenTemplateType;
    version: CodeGenVersion;
    targetPath: string;
    content: string;
    variables?: CodeGenTemplateVariable[];
    tags?: string[];
    metadata?: CodeGenMetadata;
}
export declare class CodeGenTemplateEngine {
    readonly catalog: CodeGenTemplateCatalog;
    readonly compiler: CodeGenTemplateCompiler;
    readonly renderer: CodeGenTemplateRenderer;
    readonly loader: CodeGenTemplateLoader;
    readonly cache: CodeGenTemplateCache;
    constructor(catalog?: CodeGenTemplateCatalog, compiler?: CodeGenTemplateCompiler, renderer?: CodeGenTemplateRenderer, loader?: CodeGenTemplateLoader, cache?: CodeGenTemplateCache);
    create(input: CreateTemplateInput): CodeGenTemplateDefinition;
    register(template: CodeGenTemplateDefinition, replace?: boolean): CodeGenTemplateDefinition;
    loadManifest(manifestPath: string, replace?: boolean): Promise<CodeGenTemplateDefinition>;
    loadDirectory(rootPath: string, replace?: boolean): Promise<{
        templates: CodeGenTemplateDefinition[];
        warnings: string[];
    }>;
    get(key: string): CodeGenTemplateDefinition;
    find(key: string): CodeGenTemplateDefinition | undefined;
    list(): CodeGenTemplateDefinition[];
    compile(key: string): CodeGenCompiledTemplate;
    render(key: string, context: CodeGenTemplateRenderContext): CodeGenRenderedTemplate;
    renderMany(keys: readonly string[], context: CodeGenTemplateRenderContext): CodeGenRenderedTemplate[];
    remove(key: string): CodeGenTemplateDefinition;
    clear(): void;
    snapshot(): {
        templates: number;
        activeTemplates: number;
        cache: import("./codegen-template.contracts").CodeGenTemplateCacheSnapshot;
        generatedAt: string;
    };
    private registerLoaded;
    private applyDefaults;
    private validateRequiredVariables;
}
//# sourceMappingURL=codegen-template-engine.d.ts.map