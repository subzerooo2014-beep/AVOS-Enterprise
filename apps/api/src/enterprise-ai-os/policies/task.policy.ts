import { Injectable } from "@nestjs/common";
@Injectable()
export class TaskPolicy {
  validate(type: string, input: Record<string, unknown>) {
    if (!type) throw new Error("Task type required");
    if (!input) throw new Error("Task input required");
    return true;
  }
}
