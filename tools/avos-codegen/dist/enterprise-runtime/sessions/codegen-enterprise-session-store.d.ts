import { CodeGenEnterpriseGenerationSession } from "../contracts/codegen-enterprise-runtime.contracts";
export declare class CodeGenEnterpriseSessionStore {
    private readonly sessions;
    save(session: CodeGenEnterpriseGenerationSession): CodeGenEnterpriseGenerationSession;
    get(sessionId: string): CodeGenEnterpriseGenerationSession;
    find(sessionId: string): CodeGenEnterpriseGenerationSession | undefined;
    list(): CodeGenEnterpriseGenerationSession[];
    remove(sessionId: string): CodeGenEnterpriseGenerationSession;
    clear(): void;
}
//# sourceMappingURL=codegen-enterprise-session-store.d.ts.map