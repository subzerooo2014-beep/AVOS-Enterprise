"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequired = validateRequired;
function validateRequired(value, field) {
    if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
    }
}
//# sourceMappingURL=required.validator.js.map