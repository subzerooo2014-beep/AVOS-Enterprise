import {
  CodeGenArtifactChange,
  CodeGenArtifactChangeType,
  CodeGenRegenerationDecision,
} from "../contracts/codegen-incremental.contracts";

export interface CodeGenRegenerationPolicy {
  regenerateModified: boolean;
  generateCreated: boolean;
  deleteRemoved: boolean;
  skipUnchanged: boolean;
  failOnConflict: boolean;
}

export class CodeGenRegenerationPolicyEngine {
  normalize(
    input:
      Partial<
        CodeGenRegenerationPolicy
      > = {},
  ): CodeGenRegenerationPolicy {
    return {
      regenerateModified:
        input.regenerateModified ??
        true,
      generateCreated:
        input.generateCreated ??
        true,
      deleteRemoved:
        input.deleteRemoved ??
        false,
      skipUnchanged:
        input.skipUnchanged ??
        true,
      failOnConflict:
        input.failOnConflict ??
        true,
    };
  }

  decide(
    change:
      CodeGenArtifactChange,
    policy:
      CodeGenRegenerationPolicy,
  ): CodeGenRegenerationDecision {
    switch (change.type) {
      case CodeGenArtifactChangeType.CREATED:
        return policy.generateCreated
          ? CodeGenRegenerationDecision.GENERATE
          : CodeGenRegenerationDecision.SKIP;

      case CodeGenArtifactChangeType.MODIFIED:
      case CodeGenArtifactChangeType.MOVED:
        return policy.regenerateModified
          ? CodeGenRegenerationDecision.REGENERATE
          : CodeGenRegenerationDecision.SKIP;

      case CodeGenArtifactChangeType.DELETED:
        return policy.deleteRemoved
          ? CodeGenRegenerationDecision.DELETE
          : CodeGenRegenerationDecision.SKIP;

      case CodeGenArtifactChangeType.CONFLICTED:
        return policy.failOnConflict
          ? CodeGenRegenerationDecision.CONFLICT
          : CodeGenRegenerationDecision.SKIP;

      case CodeGenArtifactChangeType.UNCHANGED:
      default:
        return policy.skipUnchanged
          ? CodeGenRegenerationDecision.SKIP
          : CodeGenRegenerationDecision.REGENERATE;
    }
  }
}
