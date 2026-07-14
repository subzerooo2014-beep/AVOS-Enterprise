import { Injectable } from "@nestjs/common";
@Injectable()
export class PromptPolicy {
  validate(code: string, template: string) {
    if (!code || !template) throw new Error("Prompt code and template required");
    return true;
  }
}
