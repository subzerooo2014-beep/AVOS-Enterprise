"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensurePositiveMoney = ensurePositiveMoney;
exports.ensureRequired = ensureRequired;
const common_1 = require("@nestjs/common");
function ensurePositiveMoney(value, field) {
    if (value < 0) {
        throw new common_1.BadRequestException(`${field} cannot be negative`);
    }
}
function ensureRequired(value, field) {
    if (value === undefined ||
        value === null ||
        value === "") {
        throw new common_1.BadRequestException(`${field} is required`);
    }
}
//# sourceMappingURL=sales-validation.helper.js.map