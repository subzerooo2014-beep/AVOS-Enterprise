import { CodeGenArtifactChange, CodeGenRegenerationDecision } from "../contracts/codegen-incremental.contracts";
export interface CodeGenRegenerationPolicy {
    regenerateModified: boolean;
    generateCreated: boolean;
    deleteRemoved: boolean;
    skipUnchanged: boolean;
    failOnConflict: boolean;
}
export declare class CodeGenRegenerationPolicyEngine {
    normalize(input?: Partial<CodeGenRegenerationPolicy>): CodeGenRegenerationPolicy;
    decide(change: CodeGenArtifactChange, policy: CodeGenRegenerationPolicy): CodeGenRegenerationDecision;
}
//# sourceMappingURL=codegen-regeneration-policy-engine.d.ts.map