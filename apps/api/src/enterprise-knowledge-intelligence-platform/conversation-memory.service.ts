import { Injectable } from "@nestjs/common";

export interface ConversationMessage {
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
}

@Injectable()
export class ConversationMemoryService {
  private readonly conversations = new Map<string, ConversationMessage[]>();

  append(conversationId: string, role: ConversationMessage["role"], content: string) {
    const messages = this.conversations.get(conversationId) ?? [];
    const message = { role, content, createdAt: new Date().toISOString() };
    messages.push(message);
    if (messages.length > 200) messages.splice(0, messages.length - 200);
    this.conversations.set(conversationId, messages);
    return { ...message };
  }

  history(conversationId: string): ConversationMessage[] {
    return (this.conversations.get(conversationId) ?? []).map((message) => ({ ...message }));
  }

  count(): number { return this.conversations.size; }
}

