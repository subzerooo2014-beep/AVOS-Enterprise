import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenEnterpriseGenerationSession,
} from "../contracts/codegen-enterprise-runtime.contracts";

export class CodeGenEnterpriseSessionStore {
  private readonly sessions =
    new Map<
      string,
      CodeGenEnterpriseGenerationSession
    >();

  save(
    session:
      CodeGenEnterpriseGenerationSession,
  ): CodeGenEnterpriseGenerationSession {
    this.sessions.set(
      session.id,
      structuredClone(session),
    );

    return structuredClone(session);
  }

  get(
    sessionId: string,
  ): CodeGenEnterpriseGenerationSession {
    const session =
      this.sessions.get(
        sessionId,
      );

    if (!session) {
      throw new CodeGenValidationError(
        `Enterprise generation session was not found: ${sessionId}`,
      );
    }

    return structuredClone(session);
  }

  find(
    sessionId: string,
  ):
    CodeGenEnterpriseGenerationSession |
    undefined {
    const session =
      this.sessions.get(
        sessionId,
      );

    return session
      ? structuredClone(session)
      : undefined;
  }

  list():
    CodeGenEnterpriseGenerationSession[] {
    return Array.from(
      this.sessions.values(),
    )
      .map(
        (session) =>
          structuredClone(session),
      )
      .sort(
        (left, right) =>
          right.createdAt.localeCompare(
            left.createdAt,
          ),
      );
  }

  remove(
    sessionId: string,
  ): CodeGenEnterpriseGenerationSession {
    const session =
      this.get(sessionId);

    this.sessions.delete(
      sessionId,
    );

    return session;
  }

  clear(): void {
    this.sessions.clear();
  }
}
