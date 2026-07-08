"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPagination = toPagination;
exports.catalogWhere = catalogWhere;
function toPagination(page, limit) {
    const safePage = Math.max(Number(page || 1), 1);
    const safeLimit = Math.min(Math.max(Number(limit || 20), 1), 100);
    return {
        page: safePage,
        limit: safeLimit,
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
    };
}
function catalogWhere(search, status) {
    const where = {};
    if (status) {
        where.status = status;
    }
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { code: { contains: search } },
        ];
    }
    return where;
}
//# sourceMappingURL=vehicle-catalog.utils.js.map