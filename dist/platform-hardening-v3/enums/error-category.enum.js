"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCategory = void 0;
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["VALIDATION"] = "validation";
    ErrorCategory["AUTHENTICATION"] = "authentication";
    ErrorCategory["AUTHORIZATION"] = "authorization";
    ErrorCategory["NOT_FOUND"] = "not_found";
    ErrorCategory["CONFLICT"] = "conflict";
    ErrorCategory["RATE_LIMIT"] = "rate_limit";
    ErrorCategory["TIMEOUT"] = "timeout";
    ErrorCategory["DATABASE"] = "database";
    ErrorCategory["EXTERNAL_SERVICE"] = "external_service";
    ErrorCategory["INTERNAL"] = "internal";
    ErrorCategory["UNKNOWN"] = "unknown";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
//# sourceMappingURL=error-category.enum.js.map