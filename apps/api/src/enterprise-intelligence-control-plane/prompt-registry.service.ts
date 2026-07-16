import { Injectable } from "@nestjs/common";
import type { PromptTemplateRecord } from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class PromptRegistryService {
  private readonly prompts = new Map<string, PromptTemplateRecord>();

  register(prompt: PromptTemplateRecord): PromptTemplateRecord {
    this.prompts.set(prompt.id, {
      ...prompt,
      variables: [...prompt.variables],
    });

    return { ...prompt, variables: [...prompt.variables] };
  }

  list(): PromptTemplateRecord[] {
    return Array.from(this.prompts.values()).map((prompt) => ({
      ...prompt,
      variables: [...prompt.variables],
    }));
  }

  render(id: string, variables: Record<string, unknown>): string | undefined {
    const prompt = this.prompts.get(id);
    if (!prompt || !prompt.enabled) return undefined;

    return prompt.variables.reduce(
      (output, variable) =>
        output.replace(
          new RegExp(`{{\\s*${variable}\\s*}}`, "g"),
          String(variables[variable] ?? ""),
        ),
      prompt.template,
    );
  }

  count(): number {
    return this.prompts.size;
  }
}
