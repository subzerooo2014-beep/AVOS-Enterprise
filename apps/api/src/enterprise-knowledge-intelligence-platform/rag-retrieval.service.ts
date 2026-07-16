import { Injectable } from "@nestjs/common";
import { PromptManagementService } from "./prompt-management.service";
import { SemanticSearchService } from "./semantic-search.service";

@Injectable()
export class RagRetrievalService {
  constructor(
    private readonly search: SemanticSearchService,
    private readonly prompts: PromptManagementService,
  ) {}

  retrieve(query: string, namespace = "knowledge", limit = 5, promptId?: string) {
    const context = this.search.search(query, namespace, limit);
    const prompt = promptId
      ? this.prompts.render(promptId, {
          query,
          context: context.map((item) => item.content).join("\n\n"),
        })
      : undefined;

    return {
      success: true,
      query,
      context,
      prompt,
      retrievedAt: new Date().toISOString(),
    };
  }
}
