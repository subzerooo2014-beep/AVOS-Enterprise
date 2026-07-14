import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskPolicy } from "../policies/task.policy";
import { AiTaskRecord } from "../enterprise-ai-os.types";
import { aiOsId } from "../enterprise-ai-os.utils";
@Injectable()
export class TaskRuntimeService {
  private readonly tasks = new Map<string, AiTaskRecord>();
  constructor(private readonly policy: TaskPolicy) {}
  create(type: string, input: Record<string, unknown>) {
    this.policy.validate(type, input);
    const now = new Date().toISOString();
    const record: AiTaskRecord = {
      id: aiOsId("task"),
      type,
      input,
      status: "QUEUED",
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(record.id, record);
    return record;
  }
  get(id: string) {
    const record = this.tasks.get(id);
    if (!record) throw new NotFoundException(`Task ${id} not found`);
    return record;
  }
  assign(id: string, agentId: string) {
    const record = this.get(id);
    record.assignedAgentId = agentId;
    record.status = "RUNNING";
    record.updatedAt = new Date().toISOString();
    return record;
  }
  complete(id: string, result: Record<string, unknown>) {
    const record = this.get(id);
    record.result = result;
    record.status = "COMPLETED";
    record.updatedAt = new Date().toISOString();
    return record;
  }
  fail(id: string, error: string) {
    const record = this.get(id);
    record.error = error;
    record.status = "FAILED";
    record.updatedAt = new Date().toISOString();
    return record;
  }
  list() { return [...this.tasks.values()]; }
}
