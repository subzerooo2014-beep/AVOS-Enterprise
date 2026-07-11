"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalSnapshotStore = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenIncrementalSnapshotStore {
    async load(snapshotPath) {
        try {
            const content = await (0, promises_1.readFile)(snapshotPath, "utf8");
            return JSON.parse(content);
        }
        catch {
            return undefined;
        }
    }
    async save(snapshotPath, snapshot) {
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(snapshotPath), {
            recursive: true,
        });
        await (0, promises_1.writeFile)(snapshotPath, JSON.stringify(snapshot, null, 2), "utf8");
        return snapshotPath;
    }
}
exports.CodeGenIncrementalSnapshotStore = CodeGenIncrementalSnapshotStore;
//# sourceMappingURL=codegen-incremental-snapshot-store.js.map