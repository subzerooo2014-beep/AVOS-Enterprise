import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { WorkflowAssignment } from "./omega-workflow.types";

@Injectable()
export class WorkflowAssignmentEngineService {
  private readonly assignments = new Map<string, WorkflowAssignment>();

  assign(input: {
    readonly workflowId: string;
    readonly assignee: string;
    readonly role: WorkflowAssignment["role"];
  }): WorkflowAssignment {
    const assignment: WorkflowAssignment = {
      assignmentId: `OMEGA-ASSIGNMENT-${randomUUID()}`,
      workflowId: input.workflowId,
      assignee: input.assignee,
      role: input.role,
      assignedAt: new Date().toISOString(),
      status: "active",
    };

    this.assignments.set(assignment.assignmentId, assignment);
    return assignment;
  }

  complete(assignmentId: string): WorkflowAssignment {
    const current = this.assignments.get(assignmentId);

    if (!current) {
      throw new Error(`Workflow assignment not found: ${assignmentId}`);
    }

    const updated: WorkflowAssignment = {
      ...current,
      status: "completed",
    };

    this.assignments.set(updated.assignmentId, updated);
    return updated;
  }

  all(): readonly WorkflowAssignment[] {
    return [...this.assignments.values()];
  }
}
