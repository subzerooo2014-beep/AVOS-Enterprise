import { Injectable, NotFoundException } from "@nestjs/common";
import type { AiGovernedPromptRecord } from "./enterprise-ai-governance.types";

@Injectable()
export class PromptGovernanceService {
  private readonly prompts = new Map<string, AiGovernedPromptRecord>();

  register(
    input: Omit<AiGovernedPromptRecord, "createdAt" | "updatedAt">,
  ): AiGovernedPromptRecord {
    const existing = this.prompts.get(input.id);
    const now = new Date().toISOString();

    const prompt: AiGovernedPromptRecord = {
      ...input,
      variables: [...input.variables],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.prompts.set(prompt.id, prompt);
    return this.clone(prompt);
  }

  approve(id: string): AiGovernedPromptRecord {
    const prompt = this.requirePrompt(id);
    prompt.status = "APPROVED";
    prompt.updatedAt = new Date().toISOString();
    return this.clone(prompt);
  }

  reject(id: string): AiGovernedPromptRecord {
    const prompt = this.requirePrompt(id);
    prompt.status = "REJECTED";
    prompt.updatedAt = new Date().toISOString();
    return this.clone(prompt);
  }

  render(
    id: string,
    variables: Record<string, unknown>,
  ): string {
    const prompt = this.requirePrompt(id);

    if (prompt.status !== "APPROVED") {
      throw new Error(`Prompt '${id}' is not approved.`);
    }

    return prompt.variables.reduce(
      (output, variable) =>
        output.replace(
          new RegExp(`{{\\s*${variable}\\s*}}`, "g"),
          String(variables[variable] ?? ""),
        ),
      prompt.template,
    );
  }

  list(): AiGovernedPromptRecord[] {
    return Array.from(this.prompts.values()).map((prompt) =>
      this.clone(prompt),
    );
  }

  count(): number {
    return this.prompts.size;
  }

  approvedCount(): number {
    return this.list().filter((prompt) => prompt.status === "APPROVED").length;
  }

  private requirePrompt(id: string): AiGovernedPromptRecord {
    const prompt = this.prompts.get(id);

    if (!prompt) {
      throw new NotFoundException(`Governed prompt '${id}' was not found.`);
    }

    return prompt;
  }

  private clone(prompt: AiGovernedPromptRecord): AiGovernedPromptRecord {
    return {
      ...prompt,
      variables: [...prompt.variables],
    };
  }
}
