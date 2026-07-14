import { Injectable } from "@nestjs/common";
@Injectable()
export class SearchIndexPipeline {
  run(input: Record<string, unknown>) {
    return { id: "search-index_"+Date.now(), input, status: "COMPLETED" };
  }
}
