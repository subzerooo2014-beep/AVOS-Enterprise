import { Injectable } from "@nestjs/common";
import {
  NervousWorkflowDefinition,
  NervousWorkflowExecution
} from "../enterprise-nervous-system-mega-pack-3.types";
import { NervousSagaService } from "../saga/nervous-saga.service";
import { NervousWorkflowAuditService } from "../observability/nervous-workflow-audit.service";

@Injectable()
export class NervousCompensationService {
  constructor(
    private readonly sagas: NervousSagaService,
    private readonly audit: NervousWorkflowAuditService
  ) {}

  compensate(input: {
    execution: NervousWorkflowExecution;
    workflow: NervousWorkflowDefinition;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const completedStepIds = input.execution.steps
      .filter((step) => step.status === "completed")
      .map((step) => step.stepId);

    const compensationStepIds = input.workflow.steps
      .filter(
        (step) =>
          completedStepIds.includes(step.id) &&
          Boolean(step.compensationStepId)
      )
      .map((step) => step.compensationStepId as string)
      .reverse();

    const saga = this.sagas.create({
      executionId: input.execution.id,
      completedStepIds,
      compensationStepIds
    });

    this.sagas.updateStatus(saga.id, "compensating");

    const compensated: string[] = [];
    const failed: string[] = [];

    for (const compensationStepId of compensationStepIds) {
      const exists = input.workflow.steps.some(
        (step) => step.id === compensationStepId
      );

      if (exists) compensated.push(compensationStepId);
      else failed.push(compensationStepId);
    }

    const finalSaga = this.sagas.updateStatus(
      saga.id,
      failed.length === 0 ? "completed" : "failed"
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "compensation",
      action: "workflow-compensation-completed",
      subjectId: finalSaga.id,
      actorIdentityId: input.actorIdentityId,
      outcome: failed.length === 0 ? "success" : "failure",
      metadata: {
        compensated,
        failed
      }
    });

    return {
      saga: finalSaga,
      compensated,
      failed
    };
  }

  summary() {
    return this.sagas.summary();
  }
}
