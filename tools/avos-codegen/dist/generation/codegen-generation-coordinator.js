"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationCoordinator = void 0;
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const codegen_artifact_contracts_1 = require("../artifacts/codegen-artifact.contracts");
const codegen_generation_contracts_1 = require("./codegen-generation.contracts");
const codegen_generation_journal_1 = require("./journal/codegen-generation-journal");
const codegen_generation_planner_1 = require("./planning/codegen-generation-planner");
const codegen_generation_session_manager_1 = require("./sessions/codegen-generation-session-manager");
const codegen_generation_transaction_1 = require("./transactions/codegen-generation-transaction");
class CodeGenGenerationCoordinator {
    sessions;
    planner;
    journal;
    constructor(sessions = new codegen_generation_session_manager_1.CodeGenGenerationSessionManager(), planner = new codegen_generation_planner_1.CodeGenGenerationPlanner(), journal = new codegen_generation_journal_1.CodeGenGenerationJournal()) {
        this.sessions = sessions;
        this.planner = planner;
        this.journal = journal;
    }
    async execute(input) {
        const session = this.sessions.create(input);
        this.sessions.setArtifacts(session.id, input.artifacts);
        this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.PLANNING);
        this.journal.write({
            sessionId: session.id,
            level: codegen_generation_journal_1.CodeGenGenerationJournalLevel.INFORMATIONAL,
            code: "SESSION_PLANNING_STARTED",
            message: "Generation session planning started",
        });
        const plan = this.planner.createPlan(input.artifacts);
        this.sessions.mutate(session.id, (mutable) => {
            mutable.plan = plan;
        });
        this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.READY);
        if (input.dryRun) {
            this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.COMMITTED);
            this.journal.write({
                sessionId: session.id,
                level: codegen_generation_journal_1.CodeGenGenerationJournalLevel.INFORMATIONAL,
                code: "SESSION_DRY_RUN_COMPLETED",
                message: "Dry-run generation session completed",
            });
            return {
                session: this.sessions.get(session.id),
                transaction: undefined,
                journal: this.journal.list(session.id),
            };
        }
        const transaction = new codegen_generation_transaction_1.CodeGenGenerationTransaction(session.id);
        try {
            this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.RUNNING);
            for (const artifact of plan.orderedArtifacts) {
                const startedAt = new Date().toISOString();
                const absolutePath = (0, node_path_1.resolve)(input.targetRoot, artifact.relativePath);
                await transaction.stageWrite({
                    artifactKey: artifact.key,
                    absolutePath,
                    content: artifact.content,
                });
                this.sessions.appendRecord(session.id, {
                    artifactKey: artifact.key,
                    status: codegen_artifact_contracts_1.CodeGenArtifactStatus.GENERATED,
                    absolutePath,
                    checksum: (0, node_crypto_1.createHash)("sha256")
                        .update(artifact.content)
                        .digest("hex"),
                    bytes: Buffer.byteLength(artifact.content, "utf8"),
                    metadata: structuredClone(artifact.metadata),
                    startedAt,
                    completedAt: new Date().toISOString(),
                });
                this.journal.write({
                    sessionId: session.id,
                    level: codegen_generation_journal_1.CodeGenGenerationJournalLevel.INFORMATIONAL,
                    code: "ARTIFACT_STAGED",
                    message: `Artifact staged: ${artifact.key}`,
                    artifactKey: artifact.key,
                    details: {
                        absolutePath,
                    },
                });
            }
            await transaction.execute();
            this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.COMMITTING);
            transaction.commit();
            this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.COMMITTED);
            this.journal.write({
                sessionId: session.id,
                level: codegen_generation_journal_1.CodeGenGenerationJournalLevel.INFORMATIONAL,
                code: "SESSION_COMMITTED",
                message: "Generation session committed successfully",
            });
            return {
                session: this.sessions.get(session.id),
                transaction: transaction.snapshot(),
                journal: this.journal.list(session.id),
            };
        }
        catch (error) {
            this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.ROLLING_BACK);
            await transaction.rollback();
            this.sessions.setStatus(session.id, codegen_generation_contracts_1.CodeGenGenerationSessionStatus.ROLLED_BACK, error instanceof Error
                ? error.message
                : String(error));
            this.journal.write({
                sessionId: session.id,
                level: codegen_generation_journal_1.CodeGenGenerationJournalLevel.ERROR,
                code: "SESSION_ROLLED_BACK",
                message: "Generation session failed and was rolled back",
                details: {
                    error: error instanceof Error
                        ? error.message
                        : String(error),
                },
            });
            throw error;
        }
    }
}
exports.CodeGenGenerationCoordinator = CodeGenGenerationCoordinator;
//# sourceMappingURL=codegen-generation-coordinator.js.map