export interface CodeGenBuildRequest {
    cwd: string;
    command: string;
    args: string[];
    environment?: NodeJS.ProcessEnv;
}
export interface CodeGenBuildResult {
    success: boolean;
    exitCode: number;
    command: string;
    stdout: string;
    stderr: string;
    startedAt: string;
    completedAt: string;
}
export declare class CodeGenBuildOrchestrator {
    run(request: CodeGenBuildRequest): Promise<CodeGenBuildResult>;
}
//# sourceMappingURL=codegen-build-orchestrator.d.ts.map