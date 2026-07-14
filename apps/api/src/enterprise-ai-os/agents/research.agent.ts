import { Injectable } from "@nestjs/common";
@Injectable()
export class ResearchAgent {
  execute(input: Record<string, unknown>) {
    return { findings: [], input, status: "COMPLETED" };
  }
}
