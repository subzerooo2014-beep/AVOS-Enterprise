import { Injectable } from "@nestjs/common";

@Injectable()
export class TerminologyRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "terminology_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
