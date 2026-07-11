"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenWorkspaceSnapshotManager = void 0;
class CodeGenWorkspaceSnapshotManager {
    create(name) {
        return {
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString()
        };
    }
}
exports.CodeGenWorkspaceSnapshotManager = CodeGenWorkspaceSnapshotManager;
//# sourceMappingURL=codegen-workspace-snapshot-manager.js.map