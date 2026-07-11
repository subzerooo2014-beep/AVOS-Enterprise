import {
  createHash,
} from "node:crypto";
import {
  resolve,
} from "node:path";
import {
  CodeGenArtifactStatus,
} from "../artifacts/codegen-artifact.contracts";
import {
  CodeGenGenerationSessionInput,
  CodeGenGenerationSessionStatus,
} from "./codegen-generation.contracts";
import {
  CodeGenGenerationJournal,
  CodeGenGenerationJournalLevel,
} from "./journal/codegen-generation-journal";
import {
  CodeGenGenerationPlanner,
} from "./planning/codegen-generation-planner";
import {
  CodeGenGenerationSessionManager,
} from "./sessions/codegen-generation-session-manager";
import {
  CodeGenGenerationTransaction,
} from "./transactions/codegen-generation-transaction";

export class CodeGenGenerationCoordinator {
  constructor(
    readonly sessions =
      new CodeGenGenerationSessionManager(),
    readonly planner =
      new CodeGenGenerationPlanner(),
    readonly journal =
      new CodeGenGenerationJournal(),
  ) {}

  async execute(
    input:
      CodeGenGenerationSessionInput & {
        artifacts:
          Parameters<
            CodeGenGenerationPlanner["createPlan"]
          >[0];
      },
  ) {
    const session =
      this.sessions.create(input);

    this.sessions.setArtifacts(
      session.id,
      input.artifacts,
    );

    this.sessions.setStatus(
      session.id,
      CodeGenGenerationSessionStatus.PLANNING,
    );

    this.journal.write({
      sessionId:
        session.id,
      level:
        CodeGenGenerationJournalLevel.INFORMATIONAL,
      code:
        "SESSION_PLANNING_STARTED",
      message:
        "Generation session planning started",
    });

    const plan =
      this.planner.createPlan(
        input.artifacts,
      );

    this.sessions.mutate(
      session.id,
      (mutable) => {
        mutable.plan = plan;
      },
    );

    this.sessions.setStatus(
      session.id,
      CodeGenGenerationSessionStatus.READY,
    );

    if (input.dryRun) {
      this.sessions.setStatus(
        session.id,
        CodeGenGenerationSessionStatus.COMMITTED,
      );

      this.journal.write({
        sessionId:
          session.id,
        level:
          CodeGenGenerationJournalLevel.INFORMATIONAL,
        code:
          "SESSION_DRY_RUN_COMPLETED",
        message:
          "Dry-run generation session completed",
      });

      return {
        session:
          this.sessions.get(
            session.id,
          ),
        transaction:
          undefined,
        journal:
          this.journal.list(
            session.id,
          ),
      };
    }

    const transaction =
      new CodeGenGenerationTransaction(
        session.id,
      );

    try {
      this.sessions.setStatus(
        session.id,
        CodeGenGenerationSessionStatus.RUNNING,
      );

      for (
        const artifact of
        plan.orderedArtifacts
      ) {
        const startedAt =
          new Date().toISOString();

        const absolutePath =
          resolve(
            input.targetRoot,
            artifact.relativePath,
          );

        await transaction.stageWrite({
          artifactKey:
            artifact.key,
          absolutePath,
          content:
            artifact.content,
        });

        this.sessions.appendRecord(
          session.id,
          {
            artifactKey:
              artifact.key,
            status:
              CodeGenArtifactStatus.GENERATED,
            absolutePath,
            checksum:
              createHash("sha256")
                .update(
                  artifact.content,
                )
                .digest("hex"),
            bytes:
              Buffer.byteLength(
                artifact.content,
                "utf8",
              ),
            metadata:
              structuredClone(
                artifact.metadata,
              ),
            startedAt,
            completedAt:
              new Date().toISOString(),
          },
        );

        this.journal.write({
          sessionId:
            session.id,
          level:
            CodeGenGenerationJournalLevel.INFORMATIONAL,
          code:
            "ARTIFACT_STAGED",
          message:
            `Artifact staged: ${artifact.key}`,
          artifactKey:
            artifact.key,
          details: {
            absolutePath,
          },
        });
      }

      await transaction.execute();

      this.sessions.setStatus(
        session.id,
        CodeGenGenerationSessionStatus.COMMITTING,
      );

      transaction.commit();

      this.sessions.setStatus(
        session.id,
        CodeGenGenerationSessionStatus.COMMITTED,
      );

      this.journal.write({
        sessionId:
          session.id,
        level:
          CodeGenGenerationJournalLevel.INFORMATIONAL,
        code:
          "SESSION_COMMITTED",
        message:
          "Generation session committed successfully",
      });

      return {
        session:
          this.sessions.get(
            session.id,
          ),
        transaction:
          transaction.snapshot(),
        journal:
          this.journal.list(
            session.id,
          ),
      };
    } catch (error) {
      this.sessions.setStatus(
        session.id,
        CodeGenGenerationSessionStatus.ROLLING_BACK,
      );

      await transaction.rollback();

      this.sessions.setStatus(
        session.id,
        CodeGenGenerationSessionStatus.ROLLED_BACK,
        error instanceof Error
          ? error.message
          : String(error),
      );

      this.journal.write({
        sessionId:
          session.id,
        level:
          CodeGenGenerationJournalLevel.ERROR,
        code:
          "SESSION_ROLLED_BACK",
        message:
          "Generation session failed and was rolled back",
        details: {
          error:
            error instanceof Error
              ? error.message
              : String(error),
        },
      });

      throw error;
    }
  }
}
