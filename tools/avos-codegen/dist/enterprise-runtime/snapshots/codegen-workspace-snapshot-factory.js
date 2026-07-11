"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenWorkspaceSnapshotFactory = void 0;
const node_crypto_1 = require("node:crypto");
class CodeGenWorkspaceSnapshotFactory {
    create(input) {
        return {
            id: (0, node_crypto_1.randomUUID)(),
            sessionId: input.sessionId,
            workspaceRoot: input.workspaceRoot,
            targetRoot: input.targetRoot,
            artifacts: structuredClone([...input.artifacts]),
            metadata: structuredClone(input.metadata ?? {}),
            createdAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenWorkspaceSnapshotFactory = CodeGenWorkspaceSnapshotFactory;
//# sourceMappingURL=codegen-workspace-snapshot-factory.js.map