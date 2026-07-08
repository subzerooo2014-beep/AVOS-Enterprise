"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteData = softDeleteData;
function softDeleteData() {
    return {
        deletedAt: new Date(),
        isDeleted: true,
    };
}
//# sourceMappingURL=soft-delete.util.js.map