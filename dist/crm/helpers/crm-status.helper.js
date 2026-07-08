"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCrmStatus = isValidCrmStatus;
exports.isFinalCrmStatus = isFinalCrmStatus;
exports.isActiveCrmStatus = isActiveCrmStatus;
const crm_constants_1 = require("../constants/crm.constants");
function isValidCrmStatus(status) {
    return crm_constants_1.CRM_STATUSES.includes(status);
}
function isFinalCrmStatus(status) {
    return ["WON", "LOST", "INACTIVE"].includes(status);
}
function isActiveCrmStatus(status) {
    return ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY"].includes(status);
}
//# sourceMappingURL=crm-status.helper.js.map