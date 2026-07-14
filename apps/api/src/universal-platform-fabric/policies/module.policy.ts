import { Injectable } from "@nestjs/common";
@Injectable()
export class ModulePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid module input");
    return true;
  }
}
