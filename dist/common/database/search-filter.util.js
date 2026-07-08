"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearchFilter = buildSearchFilter;
function buildSearchFilter(search, fields = []) {
    if (!search || fields.length === 0)
        return undefined;
    return {
        OR: fields.map((field) => ({
            [field]: {
                contains: search,
                mode: "insensitive",
            },
        })),
    };
}
//# sourceMappingURL=search-filter.util.js.map