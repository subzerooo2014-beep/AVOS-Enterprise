"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationTransaction = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const codegen_generation_contracts_1 = require("../codegen-generation.contracts");
class CodeGenGenerationTransaction {
    sessionId;
    id = (0, node_crypto_1.randomUUID)();
    operations = [];
    committed = false;
    committedAt;
    createdAt = new Date().toISOString();
    constructor(sessionId) {
        this.sessionId = sessionId;
    }
    async stageWrite(input) {
        let beforeExists = false;
        let beforeContent;
        try {
            beforeContent =
                await (0, promises_1.readFile)(input.absolutePath, "utf8");
            beforeExists = true;
        }
        catch {
            beforeExists = false;
        }
        const operation = {
            id: (0, node_crypto_1.randomUUID)(),
            type: beforeExists
                ? codegen_generation_contracts_1.CodeGenTransactionOperationType.UPDATE_FILE
                : codegen_generation_contracts_1.CodeGenTransactionOperationType.CREATE_FILE,
            artifactKey: input.artifactKey,
            absolutePath: input.absolutePath,
            beforeExists,
            ...(beforeContent !== undefined
                ? {
                    beforeContent,
                    checksumBefore: this.hash(beforeContent),
                }
                : {}),
            afterContent: input.content,
            checksumAfter: this.hash(input.content),
            executed: false,
            rolledBack: false,
            createdAt: new Date().toISOString(),
        };
        this.operations.push(operation);
        return structuredClone(operation);
    }
    async execute() {
        for (const operation of this.operations) {
            if (operation.executed ||
                operation.afterContent ===
                    undefined) {
                continue;
            }
            await (0, promises_1.mkdir)((0, node_path_1.dirname)(operation.absolutePath), {
                recursive: true,
            });
            await (0, promises_1.writeFile)(operation.absolutePath, operation.afterContent, "utf8");
            operation.executed = true;
            operation.executedAt =
                new Date().toISOString();
        }
        return this.list();
    }
    commit() {
        this.committed = true;
        this.committedAt =
            new Date().toISOString();
    }
    async rollback() {
        for (const operation of [...this.operations].reverse()) {
            if (!operation.executed ||
                operation.rolledBack) {
                continue;
            }
            if (operation.beforeExists &&
                operation.beforeContent !==
                    undefined) {
                await (0, promises_1.mkdir)((0, node_path_1.dirname)(operation.absolutePath), {
                    recursive: true,
                });
                await (0, promises_1.writeFile)(operation.absolutePath, operation.beforeContent, "utf8");
            }
            else {
                await (0, promises_1.rm)(operation.absolutePath, {
                    force: true,
                });
            }
            operation.rolledBack = true;
            operation.rolledBackAt =
                new Date().toISOString();
        }
        this.committed = false;
        this.committedAt = undefined;
        return this.list();
    }
    list() {
        return this.operations.map((operation) => structuredClone(operation));
    }
    snapshot() {
        return {
            id: this.id,
            sessionId: this.sessionId,
            operations: this.operations.length,
            executed: this.operations.filter((operation) => operation.executed).length,
            rolledBack: this.operations.filter((operation) => operation.rolledBack).length,
            committed: this.committed,
            createdAt: this.createdAt,
            ...(this.committedAt
                ? {
                    committedAt: this.committedAt,
                }
                : {}),
            generatedAt: new Date().toISOString(),
        };
    }
    hash(content) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(content)
            .digest("hex");
    }
}
exports.CodeGenGenerationTransaction = CodeGenGenerationTransaction;
//# sourceMappingURL=codegen-generation-transaction.js.map