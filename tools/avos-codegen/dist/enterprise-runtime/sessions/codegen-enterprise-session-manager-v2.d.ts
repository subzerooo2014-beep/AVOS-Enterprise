import { CodeGenEnterpriseGenerationRequest, CodeGenEnterpriseGenerationSession, CodeGenEnterpriseSessionStatus } from "../contracts/codegen-enterprise-runtime.contracts";
import { CodeGenEnterpriseSessionStore } from "./codegen-enterprise-session-store";
export declare class CodeGenEnterpriseSessionManagerV2 {
    readonly store: CodeGenEnterpriseSessionStore;
    constructor(store?: CodeGenEnterpriseSessionStore);
    create(request: CodeGenEnterpriseGenerationRequest): CodeGenEnterpriseGenerationSession;
    transition(sessionId: string, status: CodeGenEnterpriseSessionStatus, message: string, metadata?: Record<string, string | number | boolean>): CodeGenEnterpriseGenerationSession;
    addWarning(sessionId: string, warning: string): CodeGenEnterpriseGenerationSession;
    addError(sessionId: string, error: string): CodeGenEnterpriseGenerationSession;
    updateMetrics(sessionId: string, input: Partial<CodeGenEnterpriseGenerationSession["metrics"]>): CodeGenEnterpriseGenerationSession;
    cancel(sessionId: string, reason?: string): CodeGenEnterpriseGenerationSession;
    private assertTransition;
}
//# sourceMappingURL=codegen-enterprise-session-manager-v2.d.ts.map