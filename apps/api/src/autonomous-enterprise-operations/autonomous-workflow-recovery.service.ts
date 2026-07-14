import { Injectable } from '@nestjs/common';

@Injectable()
export class AutonomousWorkflowRecoveryService {
  recover(
    missionId: string,
    failedActions: string[],
  ): {
    missionId: string;
    recoveryActions: string[];
    recoverable: boolean;
  } {
    const recoveryActions = failedActions.map(
      (action, index) => `retry:${index + 1}:${action}`,
    );

    return {
      missionId,
      recoveryActions,
      recoverable: failedActions.length <= 5,
    };
  }
}