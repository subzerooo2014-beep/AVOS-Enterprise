import { Injectable, NotFoundException } from "@nestjs/common";
import { PromptPolicy } from "../policies/prompt.policy";
@Injectable()
export class PromptTemplateService {
  private readonly templates = new Map<string, Record<string, unknown>>();
  constructor(private readonly policy: PromptPolicy) {}
  create(input: {
    code: string;
    name: string;
    template: string;
    variables: string[];
  }) {
    this.policy.validate(input.code, input.template);
    const record = {
      id: `prompt_${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.templates.set(input.code, record);
    return record;
  }
  execute(code: string, values: Record<string, unknown>) {
    const template = this.templates.get(code);
    if (!template) throw new NotFoundException(`Prompt template ${code} not found`);
    let rendered = String(template.template);
    for (const [key, value] of Object.entries(values)) {
      rendered = rendered.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
        String(value),
      );
    }
    return { code, rendered, values };
  }
}
