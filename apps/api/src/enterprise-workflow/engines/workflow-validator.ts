import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowValidator {
  validate(input: any): void {
    if (!input) {
      throw new BadRequestException("Workflow payload is required.");
    }

    if (typeof input !== "object") {
      throw new BadRequestException("Workflow payload must be an object.");
    }

    if (!input.name && !input.workflowName) {
      throw new BadRequestException(
        "Workflow name is required.",
      );
    }

    if (
      input.steps !== undefined &&
      !Array.isArray(input.steps)
    ) {
      throw new BadRequestException(
        "Workflow steps must be an array.",
      );
    }
  }

  validateExecution(workflow: any): void {
    if (!workflow?.workflowId) {
      throw new BadRequestException(
        "workflowId is required.",
      );
    }
  }
}
