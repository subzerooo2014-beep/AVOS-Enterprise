import { Injectable } from "@nestjs/common";
@Injectable()
export class SemanticSearchService {
  private readonly records:Array<Record<string,unknown>> = [];

  create(input: Record<string,unknown>) {
    const record = {
      id: "semantic-search_"+Date.now(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }
}
