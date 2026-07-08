"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSalesExportRows = toSalesExportRows;
function toSalesExportRows(items) {
    return (items ?? []).map((sale) => ({
        id: sale.id,
        number: sale.number,
        status: sale.status,
        customerId: sale.customerId,
        vehicleId: sale.vehicleId,
        total: sale.total,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
    }));
}
//# sourceMappingURL=sales-export.helper.js.map