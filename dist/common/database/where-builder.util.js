"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhere = buildWhere;
function buildWhere(search, fields = []) {
    if (!search)
        return {};
    return {
        OR: fields.map((field) => ({
            [field]: { contains: search, mode: "insensitive" },
        })),
    };
}
//# sourceMappingURL=where-builder.util.js.map