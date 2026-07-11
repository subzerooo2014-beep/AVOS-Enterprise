import { CodeGenLoadedTemplate, CodeGenTemplateDirectoryLoadResult } from "../codegen-template.contracts";
export interface LoadTemplateManifestOptions {
    replaceRoot?: string;
    encoding?: BufferEncoding;
}
export declare class CodeGenTemplateLoader {
    loadManifest(manifestPath: string, options?: LoadTemplateManifestOptions): Promise<CodeGenLoadedTemplate>;
    loadDirectory(rootPath: string): Promise<CodeGenTemplateDirectoryLoadResult>;
    private validateManifest;
    private walk;
}
//# sourceMappingURL=codegen-template-loader.d.ts.map