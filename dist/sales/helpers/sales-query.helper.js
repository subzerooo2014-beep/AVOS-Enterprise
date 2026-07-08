"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSalesPaging = normalizeSalesPaging;
exports.buildSalesWhere = buildSalesWhere;
const sales_constants_1 = require("../constants/sales.constants");
function normalizeSalesPaging(query = {}) {
    const page = Math.max(Number(query.page ?? sales_constants_1.DEFAULT_SALES_PAGE), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? query.take ?? sales_constants_1.DEFAULT_SALES_LIMIT), 1), sales_constants_1.MAX_SALES_LIMIT);
    return {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
    };
}
function buildSalesWhere(query = {}) {
    const where = {};
    if (query.status)
        where.status = query.status;
    if (query.customerId)
        where.customerId = query.customerId;
    if (query.vehicleId)
        where.vehicleId = query.vehicleId;
    if (query.search) {
        where.OR = [
            { number: { contains: query.search, mode: 'insensitive' } },
            { customerName: { contains: query.search, mode: 'insensitive' } },
            { customerPhone: { contains: query.search, mode: 'insensitive' } },
            { customerEmail: { contains: query.search, mode: 'insensitive' } },
        ];
    }
    return where;
}
//# sourceMappingURL=sales-query.helper.js.map