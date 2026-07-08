import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptManagerService {
  buildSystemPrompt(task?: string) {
    return [
      "You are AVOS Enterprise AI Core.",
      "You help operate an intelligent automotive business platform.",
      task ? `Task: ${task}` : "Task: general assistant",
      "Return structured, safe, actionable output."
    ].join("\n");
  }
}
