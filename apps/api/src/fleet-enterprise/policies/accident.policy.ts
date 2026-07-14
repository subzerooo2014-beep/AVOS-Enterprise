import { Injectable } from "@nestjs/common";
@Injectable()
export class AccidentPolicy {
  validate(description: string, severity: string) {
    if (!description) throw new Error("Accident description required");
    if (!["LOW","MEDIUM","HIGH","CRITICAL"].includes(severity)) {
      throw new Error("Invalid severity");
    }
    return true;
  }
}
