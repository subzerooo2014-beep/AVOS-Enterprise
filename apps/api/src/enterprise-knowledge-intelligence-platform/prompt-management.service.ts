import { Injectable } from "@nestjs/common";
import type { PromptTemplate } from "./enterprise-knowledge-intelligence.types";

@Injectable()
export class PromptManagementService {
  private readonly prompts = new Map<string, PromptTemplate>();

  register(prompt: PromptTemplate): PromptTemplate {
    this.prompts.set(prompt.id, { ...prompt, variables: [...prompt.variables] });
    return { ...prompt, variables: [...prompt.variables] };
  }

  render(id: string, values: Record<string, unknown>): string | undefined {
    const prompt = this.prompts.get(id);
    if (!prompt || !prompt.enabled) return undefined;
    return prompt.variables.reduce(
      (output, variable) =>
        output.replace(new RegExp(`{{\\s*${variable}\\s*}}`, "g"), String(values[variable] ?? "")),
      prompt.template,
    );
  }

  list(): PromptTemplate[] {
    return Array.from(this.prompts.values()).map((prompt) => ({
      ...prompt,
      variables: [...prompt.variables],
    }));
  }

  count(): number { return this.prompts.size; }
}
