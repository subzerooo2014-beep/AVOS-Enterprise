import { Injectable } from "@nestjs/common";
import { GenesisSession } from "../types/genesis-platform.types";

@Injectable()
export class GenesisSessionRegistry {
  private readonly sessions = new Map<string, GenesisSession>();

  save(session: GenesisSession): GenesisSession {
    this.sessions.set(session.id, structuredClone(session));
    return structuredClone(session);
  }

  get(id: string): GenesisSession | undefined {
    const session = this.sessions.get(id);
    return session ? structuredClone(session) : undefined;
  }

  list(): GenesisSession[] {
    return [...this.sessions.values()].map((item) => structuredClone(item));
  }

  count(): number {
    return this.sessions.size;
  }
}
