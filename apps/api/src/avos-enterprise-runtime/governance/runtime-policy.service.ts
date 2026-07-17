import { Injectable } from '@nestjs/common';
import { RuntimeDecision } from '../contracts/runtime.contracts';
import { createRuntimeId, nowIso } from '../shared/runtime.utils';

export interface RuntimePolicyContext {
  action: string;
  subject: string;
  risk?: 'low' | 'medium' | 'high' | 'critical';
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

@Injectable()
export class RuntimePolicyService {
  evaluate(context: RuntimePolicyContext): RuntimeDecision {
    const reasons: string[] = [];
    let outcome: RuntimeDecision['outcome'] = 'allow';

    if (context.risk === 'critical') {
      outcome = 'review';
      reasons.push('critical-risk-requires-human-approval');
    }

    if (
      context.permissions &&
      !context.permissions.includes(context.action) &&
      !context.permissions.includes('*')
    ) {
      outcome = 'deny';
      reasons.push('required-permission-missing');
    }

    if (reasons.length === 0) {
      reasons.push('policy-checks-passed');
    }

    return {
      id: createRuntimeId('decision'),
      type: 'runtime-policy',
      subject: context.subject,
      outcome,
      reasons,
      authority: outcome === 'review' ? 'hybrid' : 'system',
      createdAt: nowIso(),
    };
  }
}