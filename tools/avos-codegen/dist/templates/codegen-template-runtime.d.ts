import { CodeGenJsonValue } from "../core/codegen.contracts";
import { CodeGenRenderedTemplate, CodeGenTemplateDefinition } from "./codegen-template.contracts";
import { CodeGenTemplateEngine } from "./codegen-template-engine";
export interface InitializeTemplateRuntimeInput {
    templateRoot: string;
    replace?: boolean;
}
export interface RenderTemplateRuntimeInput {
    templateKey: string;
    variables: Record<string, CodeGenJsonValue>;
    strict?: boolean;
    partials?: Record<string, string>;
}
export declare class CodeGenTemplateRuntime {
    readonly engine: CodeGenTemplateEngine;
    private initialized;
    private initializedAt;
    constructor(engine?: CodeGenTemplateEngine);
    initialize(input: InitializeTemplateRuntimeInput): Promise<{
        templates: CodeGenTemplateDefinition[];
        warnings: string[];
    }>;
    render(input: RenderTemplateRuntimeInput): CodeGenRenderedTemplate;
    renderMany(templateKeys: readonly string[], variables: Record<string, CodeGenJsonValue>, strict?: boolean): CodeGenRenderedTemplate[];
    snapshot(): {
        engine: {
            templates: number;
            activeTemplates: number;
            cache: import("./codegen-template.contracts").CodeGenTemplateCacheSnapshot;
            generatedAt: string;
        };
        generatedAt: string;
        initializedAt?: string;
        initialized: boolean;
    };
}
//# sourceMappingURL=codegen-template-runtime.d.ts.map