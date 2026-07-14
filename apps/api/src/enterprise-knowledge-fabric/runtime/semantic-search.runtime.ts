import { Injectable } from "@nestjs/common";
@Injectable()
export class SemanticSearchRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "semantic-search_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
