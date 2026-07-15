import { Injectable } from '@nestjs/common';
import { DecisionExecution } from './enterprise-ai-operations.types';

@Injectable()
export class AiDecisionExecutionEngineService {
  execute(
    input: Omit<DecisionExecution, 'executed'>,
  ): DecisionExecution {
    return {
      ...input,
      executed: input.approved && input.confidence >= 0.75,
    };
  }
}