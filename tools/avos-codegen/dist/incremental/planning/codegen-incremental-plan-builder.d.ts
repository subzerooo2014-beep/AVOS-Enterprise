import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenExecutionPlan } from "../../planning/contracts/codegen-planning.contracts";
import { CodeGenArtifactChange, CodeGenIncrementalExecutionPlan } from "../contracts/codegen-incremental.contracts";
import { CodeGenRegenerationPolicy, CodeGenRegenerationPolicyEngine } from "../regeneration/codegen-regeneration-policy-engine";
export declare class CodeGenIncrementalPlanBuilder {
    readonly policies: CodeGenRegenerationPolicyEngine;
    constructor(policies?: CodeGenRegenerationPolicyEngine);
    build(basePlan: CodeGenExecutionPlan, artifacts: readonly CodeGenArtifactDescriptor[], changes: readonly CodeGenArtifactChange[], policyInput?: Partial<CodeGenRegenerationPolicy>): CodeGenIncrementalExecutionPlan;
}
//# sourceMappingURL=codegen-incremental-plan-builder.d.ts.map