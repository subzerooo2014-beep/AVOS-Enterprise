"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCustomer360 = buildCustomer360;
function buildCustomer360(record, sales = [], vehicles = [], tasks = []) {
    return {
        profile: record,
        sales,
        vehicles,
        tasks,
        summary: {
            salesCount: sales.length,
            vehiclesCount: vehicles.length,
            tasksCount: tasks.length,
            totalSalesValue: sales.reduce((sum, item) => sum + Number(item?.total ?? 0), 0),
        },
    };
}
//# sourceMappingURL=crm-customer360.helper.js.map