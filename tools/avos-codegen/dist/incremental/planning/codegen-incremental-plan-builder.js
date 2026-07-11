"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalPlanBuilder = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_incremental_contracts_1 = require("../contracts/codegen-incremental.contracts");
const codegen_regeneration_policy_engine_1 = require("../regeneration/codegen-regeneration-policy-engine");
class CodeGenIncrementalPlanBuilder {
    policies;
    constructor(policies = new codegen_regeneration_policy_engine_1.CodeGenRegenerationPolicyEngine()) {
        this.policies = policies;
    }
    build(basePlan, artifacts, changes, policyInput = {}) {
        const policy = this.policies.normalize(policyInput);
        const artifactsByKey = new Map(artifacts.map((artifact) => [
            artifact.key,
            artifact,
        ]));
        const items = changes
            .map((change) => {
            const artifact = artifactsByKey.get(change.artifactKey);
            if (!artifact) {
                return undefined;
            }
            const decision = this.policies.decide(change, policy);
            const node = basePlan.nodes.find((candidate) => candidate.key ===
                artifact.key);
            return {
                artifact: structuredClone(artifact),
                decision,
                change: structuredClone(change),
                priority: 100 +
                    (node?.dependents.length ??
                        0) *
                        10,
                dependencies: [...artifact.dependencies],
                reason: change.reason,
            };
        })
            .filter((item) => Boolean(item))
            .sort((left, right) => right.priority -
            left.priority);
        return {
            id: (0, node_crypto_1.randomUUID)(),
            basePlan: structuredClone(basePlan),
            items,
            generate: items
                .filter((item) => item.decision ===
                codegen_incremental_contracts_1.CodeGenRegenerationDecision.GENERATE)
                .map((item) => item.artifact.key),
            regenerate: items
                .filter((item) => item.decision ===
                codegen_incremental_contracts_1.CodeGenRegenerationDecision.REGENERATE)
                .map((item) => item.artifact.key),
            skip: items
                .filter((item) => item.decision ===
                codegen_incremental_contracts_1.CodeGenRegenerationDecision.SKIP)
                .map((item) => item.artifact.key),
            remove: items
                .filter((item) => item.decision ===
                codegen_incremental_contracts_1.CodeGenRegenerationDecision.DELETE)
                .map((item) => item.artifact.key),
            conflicts: items
                .filter((item) => item.decision ===
                codegen_incremental_contracts_1.CodeGenRegenerationDecision.CONFLICT)
                .map((item) => item.artifact.key),
            createdAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenIncrementalPlanBuilder = CodeGenIncrementalPlanBuilder;
//# sourceMappingURL=codegen-incremental-plan-builder.js.map