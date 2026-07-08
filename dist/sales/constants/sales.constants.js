"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_SALES_LIMIT = exports.DEFAULT_SALES_LIMIT = exports.DEFAULT_SALES_PAGE = exports.ACTIVE_SALES_STATUSES = exports.FINAL_SALES_STATUSES = exports.SALES_STATUSES = void 0;
exports.SALES_STATUSES = [
    'OPEN',
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'WON',
    'LOST',
    'CANCELLED',
    'CLOSED',
];
exports.FINAL_SALES_STATUSES = ['WON', 'LOST', 'CANCELLED', 'CLOSED'];
exports.ACTIVE_SALES_STATUSES = ['OPEN', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED'];
exports.DEFAULT_SALES_PAGE = 1;
exports.DEFAULT_SALES_LIMIT = 20;
exports.MAX_SALES_LIMIT = 100;
//# sourceMappingURL=sales.constants.js.map