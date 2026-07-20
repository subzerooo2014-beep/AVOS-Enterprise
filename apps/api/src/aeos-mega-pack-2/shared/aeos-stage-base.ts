import { AeosDecisionGate, AeosEvidence, AeosExecutionContext, AeosStageResult } from '../contracts/aeos-mega-pack-2.contracts';

export abstract class AeosStageBase {
  protected now(): string {
    return new Date().toISOString();
  }

  protected evidence(source: string, detail: string, confidence = 0.9): AeosEvidence {
    return { source, kind: 'runtime-assessment', confidence, detail };
  }

  protected gate(reason: string, required = true): AeosDecisionGate {
    return {
      requiresHumanApproval: required,
      authority: 'human-final-authority',
      reason,
    };
  }

  protected result<T extends Record<string, unknown>>(
    stage: AeosStageResult<T>['stage'],
    output: T,
    evidence: AeosEvidence[],
    score: number,
    reason: string,
  ): AeosStageResult<T> {
    return {
      stage,
      status: 'completed',
      score,
      output,
      evidence,
      gate: this.gate(reason),
      timestamp: this.now(),
    };
  }

  protected objective(context: AeosExecutionContext): string {
    const objective = context.objective?.trim();
    if (!objective) {
      throw new Error('AEOS objective is required.');
    }
    return objective;
  }
}
