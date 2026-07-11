import { CodeGenTemplateDefinition, CodeGenTemplateStatus, CodeGenTemplateType } from "../codegen-template.contracts";
export interface CodeGenTemplateCatalogQuery {
    status?: CodeGenTemplateStatus;
    type?: CodeGenTemplateType;
    tags?: string[];
    text?: string;
}
export declare class CodeGenTemplateCatalog {
    private readonly templates;
    register(template: CodeGenTemplateDefinition, replace?: boolean): CodeGenTemplateDefinition;
    registerMany(templates: readonly CodeGenTemplateDefinition[], replace?: boolean): CodeGenTemplateDefinition[];
    get(key: string): CodeGenTemplateDefinition;
    find(key: string): CodeGenTemplateDefinition | undefined;
    query(query?: CodeGenTemplateCatalogQuery): CodeGenTemplateDefinition[];
    listActive(): CodeGenTemplateDefinition[];
    remove(key: string): CodeGenTemplateDefinition;
    count(): number;
    clear(): void;
}
//# sourceMappingURL=codegen-template-catalog.d.ts.map