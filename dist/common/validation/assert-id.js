"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertId = assertId;
function assertId(id) {
    if (!id || typeof id !== "string") {
        throw new Error("Invalid id");
    }
}
//# sourceMappingURL=assert-id.js.map