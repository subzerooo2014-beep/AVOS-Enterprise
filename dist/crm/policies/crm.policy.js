"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmPolicy = void 0;
const common_1 = require("@nestjs/common");
const crm_constants_1 = require("../constants/crm.constants");
class CrmPolicy {
    static ensureExists(record) {
        if (!record) {
            throw new common_1.NotFoundException("CRM record not found");
        }
    }
    static ensureCanUpdate(record) {
        this.ensureExists(record);
        if (["WON", "LOST", "INACTIVE"].includes(record.status)) {
            throw new common_1.BadRequestException("Final CRM records cannot be updated");
        }
    }
    static ensureValidStatus(status) {
        if (!crm_constants_1.CRM_STATUSES.includes(status)) {
            throw new common_1.BadRequestException("Invalid CRM status");
        }
    }
    static ensureCanDelete(record) {
        this.ensureExists(record);
        if (["WON"].includes(record.status)) {
            throw new common_1.BadRequestException("Won CRM records cannot be deleted");
        }
    }
}
exports.CrmPolicy = CrmPolicy;
//# sourceMappingURL=crm.policy.js.map