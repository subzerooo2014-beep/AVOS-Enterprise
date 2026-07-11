import { CodeGenArtifactDescriptor, CodeGenArtifactExecutionRecord } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenGenerationSession, CodeGenGenerationSessionInput, CodeGenGenerationSessionStatus } from "../codegen-generation.contracts";
export declare class CodeGenGenerationSessionManager {
    private readonly sessions;
    create(input: CodeGenGenerationSessionInput): CodeGenGenerationSession;
    get(id: string): CodeGenGenerationSession;
    mutate(id: string, mutation: (session: CodeGenGenerationSession) => void): CodeGenGenerationSession;
    setArtifacts(id: string, artifacts: readonly CodeGenArtifactDescriptor[]): CodeGenGenerationSession;
    appendRecord(id: string, record: CodeGenArtifactExecutionRecord): CodeGenGenerationSession;
    setStatus(id: string, status: CodeGenGenerationSessionStatus, error?: string): CodeGenGenerationSession;
    list(): CodeGenGenerationSession[];
    remove(id: string): CodeGenGenerationSession;
    clear(): void;
}
//# sourceMappingURL=codegen-generation-session-manager.d.ts.map