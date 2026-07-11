import { CodeGenFileDescriptor, CodeGenWriteFileInput, CodeGenWriteFileResult } from "./codegen-filesystem.contracts";
export declare class CodeGenFileSystemEngine {
    describe(workspaceRoot: string, targetPath: string): Promise<CodeGenFileDescriptor>;
    read(targetPath: string, encoding?: BufferEncoding): Promise<string>;
    write(input: CodeGenWriteFileInput): Promise<CodeGenWriteFileResult>;
}
//# sourceMappingURL=codegen-filesystem-engine.d.ts.map