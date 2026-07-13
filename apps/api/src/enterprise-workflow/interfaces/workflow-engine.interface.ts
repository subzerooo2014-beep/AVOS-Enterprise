import { WorkflowContext } from "./workflow-context.interface";

export interface WorkflowEngine {
  execute(
    context: WorkflowContext,
    input: Record<string, any>,
  ): Promise<Record<string, any>>;

  validate(
    context: WorkflowContext,
  ): Promise<boolean>;

  rollback(
    context: WorkflowContext,
  ): Promise<void>;

  recover(
    context: WorkflowContext,
  ): Promise<void>;
}
