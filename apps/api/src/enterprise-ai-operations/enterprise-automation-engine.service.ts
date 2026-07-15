import { Injectable } from '@nestjs/common';

@Injectable()
export class EnterpriseAutomationEngineService {
  evaluate(input: {
    totalProcesses: number;
    automatedProcesses: number;
    successfulAutomations: number;
    failedAutomations: number;
  }) {
    const automationRate =
      input.totalProcesses === 0
        ? 0
        : (input.automatedProcesses / input.totalProcesses) * 100;

    const successRate =
      input.successfulAutomations + input.failedAutomations === 0
        ? 0
        : (input.successfulAutomations /
            (input.successfulAutomations + input.failedAutomations)) *
          100;

    return {
      ...input,
      automationRate: Number(automationRate.toFixed(2)),
      successRate: Number(successRate.toFixed(2)),
    };
  }
}