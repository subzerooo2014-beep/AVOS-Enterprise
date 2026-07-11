import { Injectable } from "@nestjs/common";

@Injectable()
export class AiMemoryService {

  private sessions = new Map<string, any[]>();

  add(sessionId: string, role: string, content: string) {
    const history = this.sessions.get(sessionId) ?? [];
    history.push({
      role,
      content,
      createdAt: new Date().toISOString(),
    });
    this.sessions.set(sessionId, history);
    return history;
  }

  get(sessionId: string) {
    return this.sessions.get(sessionId) ?? [];
  }

  clear(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
