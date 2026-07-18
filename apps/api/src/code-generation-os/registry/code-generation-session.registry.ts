import { Injectable } from "@nestjs/common";
import { CodeGenerationSession } from "../types/code-generation-os.types";

@Injectable()
export class CodeGenerationSessionRegistry {
  private readonly sessions = new Map<string, CodeGenerationSession>();

  save(session: CodeGenerationSession): CodeGenerationSession {
    session.updatedAt = new Date().toISOString();
    this.sessions.set(session.id, session);
    return session;
  }

  get(id: string): CodeGenerationSession | undefined {
    return this.sessions.get(id);
  }

  list(): CodeGenerationSession[] {
    return [...this.sessions.values()];
  }

  count(): number {
    return this.sessions.size;
  }
}
