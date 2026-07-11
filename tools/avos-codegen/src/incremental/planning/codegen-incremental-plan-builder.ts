import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenExecutionPlan,
} from "../../planning/contracts/codegen-planning.contracts";
import {
  CodeGenArtifactChange,
  CodeGenIncrementalExecutionPlan,
  CodeGenRegenerationDecision,
} from "../contracts/codegen-incremental.contracts";
import {
  CodeGenRegenerationPolicy,
  CodeGenRegenerationPolicyEngine,
} from "../regeneration/codegen-regeneration-policy-engine";

export class CodeGenIncrementalPlanBuilder {
  constructor(
    readonly policies =
      new CodeGenRegenerationPolicyEngine(),
  ) {}

  build(
    basePlan:
      CodeGenExecutionPlan,
    artifacts:
      readonly CodeGenArtifactDescriptor[],
    changes:
      readonly CodeGenArtifactChange[],
    policyInput:
      Partial<
        CodeGenRegenerationPolicy
      > = {},
  ): CodeGenIncrementalExecutionPlan {
    const policy =
      this.policies.normalize(
        policyInput,
      );

    const artifactsByKey =
      new Map(
        artifacts.map(
          (artifact) => [
            artifact.key,
            artifact,
          ],
        ),
      );

    const items =
      changes
        .map((change) => {
          const artifact =
            artifactsByKey.get(
              change.artifactKey,
            );

          if (!artifact) {
            return undefined;
          }

          const decision =
            this.policies.decide(
              change,
              policy,
            );

          const node =
            basePlan.nodes.find(
              (candidate) =>
                candidate.key ===
                artifact.key,
            );

          return {
            artifact:
              structuredClone(
                artifact,
              ),
            decision,
            change:
              structuredClone(
                change,
              ),
            priority:
              100 +
              (node?.dependents.length ??
                0) *
                10,
            dependencies:
              [...artifact.dependencies],
            reason:
              change.reason,
          };
        })
        .filter(
          (
            item,
          ): item is NonNullable<
            typeof item
          > =>
            Boolean(item),
        )
        .sort(
          (left, right) =>
            right.priority -
            left.priority,
        );

    return {
      id:
        randomUUID(),
      basePlan:
        structuredClone(
          basePlan,
        ),
      items,
      generate:
        items
          .filter(
            (item) =>
              item.decision ===
              CodeGenRegenerationDecision.GENERATE,
          )
          .map(
            (item) =>
              item.artifact.key,
          ),
      regenerate:
        items
          .filter(
            (item) =>
              item.decision ===
              CodeGenRegenerationDecision.REGENERATE,
          )
          .map(
            (item) =>
              item.artifact.key,
          ),
      skip:
        items
          .filter(
            (item) =>
              item.decision ===
              CodeGenRegenerationDecision.SKIP,
          )
          .map(
            (item) =>
              item.artifact.key,
          ),
      remove:
        items
          .filter(
            (item) =>
              item.decision ===
              CodeGenRegenerationDecision.DELETE,
          )
          .map(
            (item) =>
              item.artifact.key,
          ),
      conflicts:
        items
          .filter(
            (item) =>
              item.decision ===
              CodeGenRegenerationDecision.CONFLICT,
          )
          .map(
            (item) =>
              item.artifact.key,
          ),
      createdAt:
        new Date().toISOString(),
    };
  }
}
