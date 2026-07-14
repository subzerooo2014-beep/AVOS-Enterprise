import { Injectable } from "@nestjs/common";
@Injectable()
export class ServicePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid service input");
    return true;
  }
}
