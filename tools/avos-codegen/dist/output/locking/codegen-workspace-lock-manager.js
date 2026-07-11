"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenWorkspaceLockManager = void 0;
const node_os_1 = require("node:os");
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenWorkspaceLockManager {
    async acquire(workspaceRoot, ttlMs = 10 * 60 * 1000) {
        const root = (0, node_path_1.resolve)(workspaceRoot);
        const lockDirectory = (0, node_path_1.join)(root, ".avos-codegen");
        const lockPath = (0, node_path_1.join)(lockDirectory, "workspace.lock.json");
        await (0, promises_1.mkdir)(lockDirectory, {
            recursive: true,
        });
        const existing = await this.read(lockPath);
        if (existing) {
            const expired = Date.parse(existing.expiresAt) <= Date.now();
            if (!expired) {
                throw new codegen_errors_1.CodeGenValidationError(`Workspace is locked by process ${existing.processId} on ${existing.hostname}`);
            }
            await (0, promises_1.rm)(lockPath, {
                force: true,
            });
        }
        const acquiredAt = new Date();
        const lock = {
            id: (0, node_crypto_1.randomUUID)(),
            workspaceRoot: root,
            lockPath,
            processId: process.pid,
            hostname: (0, node_os_1.hostname)(),
            acquiredAt: acquiredAt.toISOString(),
            expiresAt: new Date(acquiredAt.getTime() +
                ttlMs).toISOString(),
            metadata: {
                runtime: "AVOS CodeGen OS",
            },
        };
        await (0, promises_1.writeFile)(lockPath, JSON.stringify(lock, null, 2), {
            encoding: "utf8",
            flag: "wx",
        });
        return lock;
    }
    async release(lock) {
        const current = await this.read(lock.lockPath);
        if (current &&
            current.id !== lock.id) {
            throw new codegen_errors_1.CodeGenValidationError("Workspace lock ownership mismatch");
        }
        await (0, promises_1.rm)(lock.lockPath, {
            force: true,
        });
    }
    async read(lockPath) {
        try {
            const raw = await (0, promises_1.readFile)(lockPath, "utf8");
            return JSON.parse(raw);
        }
        catch {
            return undefined;
        }
    }
}
exports.CodeGenWorkspaceLockManager = CodeGenWorkspaceLockManager;
//# sourceMappingURL=codegen-workspace-lock-manager.js.map