import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactExecutionRecord,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenGenerationSession,
  CodeGenGenerationSessionInput,
  CodeGenGenerationSessionStatus,
} from "../codegen-generation.contracts";

export class CodeGenGenerationSessionManager {
  private readonly sessions =
    new Map<
      string,
      CodeGenGenerationSession
    >();

  create(
    input:
      CodeGenGenerationSessionInput,
  ): CodeGenGenerationSession {
    const now =
      new Date().toISOString();

    const session:
      CodeGenGenerationSession = {
      id: randomUUID(),
      status:
        CodeGenGenerationSessionStatus.CREATED,
      workspaceRoot:
        input.workspaceRoot,
      targetRoot:
        input.targetRoot,
      dryRun:
        input.dryRun,
      variables:
        structuredClone(
          input.variables,
        ),
      metadata:
        structuredClone(
          input.metadata ?? {},
        ),
      artifacts: [],
      records: [],
      createdAt: now,
      updatedAt: now,
    };

    this.sessions.set(
      session.id,
      session,
    );

    return structuredClone(session);
  }

  get(
    id: string,
  ): CodeGenGenerationSession {
    const session =
      this.sessions.get(id);

    if (!session) {
      throw new CodeGenValidationError(
        `Generation session was not found: ${id}`,
      );
    }

    return structuredClone(session);
  }

  mutate(
    id: string,
    mutation: (
      session:
        CodeGenGenerationSession,
    ) => void,
  ): CodeGenGenerationSession {
    const session =
      this.sessions.get(id);

    if (!session) {
      throw new CodeGenValidationError(
        `Generation session was not found: ${id}`,
      );
    }

    mutation(session);
    session.updatedAt =
      new Date().toISOString();

    return structuredClone(session);
  }

  setArtifacts(
    id: string,
    artifacts:
      readonly CodeGenArtifactDescriptor[],
  ): CodeGenGenerationSession {
    return this.mutate(
      id,
      (session) => {
        session.artifacts =
          structuredClone(
            [...artifacts],
          );
      },
    );
  }

  appendRecord(
    id: string,
    record:
      CodeGenArtifactExecutionRecord,
  ): CodeGenGenerationSession {
    return this.mutate(
      id,
      (session) => {
        session.records.push(
          structuredClone(record),
        );
      },
    );
  }

  setStatus(
    id: string,
    status:
      CodeGenGenerationSessionStatus,
    error?: string,
  ): CodeGenGenerationSession {
    return this.mutate(
      id,
      (session) => {
        session.status = status;

        if (
          status ===
          CodeGenGenerationSessionStatus.RUNNING &&
          !session.startedAt
        ) {
          session.startedAt =
            new Date().toISOString();
        }

        if (
          [
            CodeGenGenerationSessionStatus.COMMITTED,
            CodeGenGenerationSessionStatus.ROLLED_BACK,
            CodeGenGenerationSessionStatus.FAILED,
          ].includes(status)
        ) {
          session.completedAt =
            new Date().toISOString();
        }

        if (error) {
          session.error = error;
        } else {
          delete session.error;
        }
      },
    );
  }

  list():
    CodeGenGenerationSession[] {
    return Array.from(
      this.sessions.values(),
    )
      .map((session) =>
        structuredClone(session),
      )
      .sort((left, right) =>
        left.createdAt.localeCompare(
          right.createdAt,
        ),
      );
  }

  remove(
    id: string,
  ): CodeGenGenerationSession {
    const session = this.get(id);
    this.sessions.delete(id);
    return session;
  }

  clear(): void {
    this.sessions.clear();
  }
}
