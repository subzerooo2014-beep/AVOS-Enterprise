"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationSessionManager = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_generation_contracts_1 = require("../codegen-generation.contracts");
class CodeGenGenerationSessionManager {
    sessions = new Map();
    create(input) {
        const now = new Date().toISOString();
        const session = {
            id: (0, node_crypto_1.randomUUID)(),
            status: codegen_generation_contracts_1.CodeGenGenerationSessionStatus.CREATED,
            workspaceRoot: input.workspaceRoot,
            targetRoot: input.targetRoot,
            dryRun: input.dryRun,
            variables: structuredClone(input.variables),
            metadata: structuredClone(input.metadata ?? {}),
            artifacts: [],
            records: [],
            createdAt: now,
            updatedAt: now,
        };
        this.sessions.set(session.id, session);
        return structuredClone(session);
    }
    get(id) {
        const session = this.sessions.get(id);
        if (!session) {
            throw new codegen_errors_1.CodeGenValidationError(`Generation session was not found: ${id}`);
        }
        return structuredClone(session);
    }
    mutate(id, mutation) {
        const session = this.sessions.get(id);
        if (!session) {
            throw new codegen_errors_1.CodeGenValidationError(`Generation session was not found: ${id}`);
        }
        mutation(session);
        session.updatedAt =
            new Date().toISOString();
        return structuredClone(session);
    }
    setArtifacts(id, artifacts) {
        return this.mutate(id, (session) => {
            session.artifacts =
                structuredClone([...artifacts]);
        });
    }
    appendRecord(id, record) {
        return this.mutate(id, (session) => {
            session.records.push(structuredClone(record));
        });
    }
    setStatus(id, status, error) {
        return this.mutate(id, (session) => {
            session.status = status;
            if (status ===
                codegen_generation_contracts_1.CodeGenGenerationSessionStatus.RUNNING &&
                !session.startedAt) {
                session.startedAt =
                    new Date().toISOString();
            }
            if ([
                codegen_generation_contracts_1.CodeGenGenerationSessionStatus.COMMITTED,
                codegen_generation_contracts_1.CodeGenGenerationSessionStatus.ROLLED_BACK,
                codegen_generation_contracts_1.CodeGenGenerationSessionStatus.FAILED,
            ].includes(status)) {
                session.completedAt =
                    new Date().toISOString();
            }
            if (error) {
                session.error = error;
            }
            else {
                delete session.error;
            }
        });
    }
    list() {
        return Array.from(this.sessions.values())
            .map((session) => structuredClone(session))
            .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
    }
    remove(id) {
        const session = this.get(id);
        this.sessions.delete(id);
        return session;
    }
    clear() {
        this.sessions.clear();
    }
}
exports.CodeGenGenerationSessionManager = CodeGenGenerationSessionManager;
//# sourceMappingURL=codegen-generation-session-manager.js.map