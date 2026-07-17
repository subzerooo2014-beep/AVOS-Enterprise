import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CreateKnowledgeRuntimeSessionInput } from "./knowledge-runtime.contracts";
import { KnowledgeRuntimeContext, KnowledgeRuntimeSession } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeRuntimeSessionService {
  private readonly sessions = new Map<string, KnowledgeRuntimeSession>();

  create(input: CreateKnowledgeRuntimeSessionInput): KnowledgeRuntimeSession {
    const now = Date.now();
    const session: KnowledgeRuntimeSession = {
      id: `krs_${randomUUID()}`,
      correlationId: input.request.correlationId ?? `krc_${randomUUID()}`,
      status: "ACTIVE",
      principal: structuredClone(input.request.principal),
      request: structuredClone(input.request),
      startedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + (input.ttlSeconds ?? 900) * 1000).toISOString(),
    };
    this.sessions.set(session.id, session);
    return structuredClone(session);
  }

  get(id: string): KnowledgeRuntimeSession {
    const session = this.sessions.get(id);
    if (!session) throw new NotFoundException(`Knowledge runtime session not found: ${id}`);
    if (session.status === "ACTIVE" && Date.parse(session.expiresAt) <= Date.now()) session.status = "EXPIRED";
    return structuredClone(session);
  }

  complete(id: string, context: KnowledgeRuntimeContext): KnowledgeRuntimeSession {
    const session = this.sessions.get(id);
    if (!session) throw new NotFoundException(`Knowledge runtime session not found: ${id}`);
    session.status = "COMPLETED";
    session.context = structuredClone(context);
    session.completedAt = new Date().toISOString();
    return structuredClone(session);
  }

  fail(id: string, error: unknown): void {
    const session = this.sessions.get(id);
    if (!session) return;
    session.status = "FAILED";
    session.error = error instanceof Error ? error.message : String(error);
    session.completedAt = new Date().toISOString();
  }

  list(): KnowledgeRuntimeSession[] {
    return [...this.sessions.values()].map((item) => structuredClone(item));
  }

  activeCount(): number {
    return [...this.sessions.values()].filter((item) => item.status === "ACTIVE" && Date.parse(item.expiresAt) > Date.now()).length;
  }
}
