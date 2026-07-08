"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesPolicy = void 0;
const common_1 = require("@nestjs/common");
class SalesPolicy {
    static ensureExists(sale) {
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
    }
    static ensureCanUpdate(sale) {
        this.ensureExists(sale);
        if (['WON', 'LOST', 'CANCELLED', 'CLOSED'].includes(sale.status)) {
            throw new common_1.BadRequestException('Closed sales cannot be updated');
        }
    }
    static ensureCanDelete(sale) {
        this.ensureExists(sale);
        if (['WON', 'CLOSED'].includes(sale.status)) {
            throw new common_1.BadRequestException('Won or closed sales cannot be deleted');
        }
    }
    static ensureValidStatus(status) {
        const allowed = ['OPEN', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'WON', 'LOST', 'CANCELLED', 'CLOSED'];
        if (!allowed.includes(status)) {
            throw new common_1.BadRequestException('Invalid sales status');
        }
    }
}
exports.SalesPolicy = SalesPolicy;
//# sourceMappingURL=sales.policy.js.map