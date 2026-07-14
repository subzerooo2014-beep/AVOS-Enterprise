import { Injectable } from "@nestjs/common";
@Injectable()
export class VectorSearchRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "vector-search_"+Date.now(), input, status: "COMPLETED" };
  }
}
