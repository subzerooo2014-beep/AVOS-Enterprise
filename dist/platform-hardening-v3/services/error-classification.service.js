"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorClassificationService = void 0;
const common_1 = require("@nestjs/common");
const error_category_enum_1 = require("../enums/error-category.enum");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
let ErrorClassificationService = class ErrorClassificationService {
    classify(error) {
        const statusCode = error instanceof common_1.HttpException
            ? error.getStatus()
            : 500;
        if (statusCode === 400 || statusCode === 422) {
            return {
                category: error_category_enum_1.ErrorCategory.VALIDATION,
                severity: incident_severity_enum_1.IncidentSeverity.WARNING,
                statusCode,
                retryable: false,
                operational: true,
            };
        }
        if (statusCode === 401) {
            return {
                category: error_category_enum_1.ErrorCategory.AUTHENTICATION,
                severity: incident_severity_enum_1.IncidentSeverity.WARNING,
                statusCode,
                retryable: false,
                operational: true,
            };
        }
        if (statusCode === 403) {
            return {
                category: error_category_enum_1.ErrorCategory.AUTHORIZATION,
                severity: incident_severity_enum_1.IncidentSeverity.WARNING,
                statusCode,
                retryable: false,
                operational: true,
            };
        }
        if (statusCode === 404) {
            return {
                category: error_category_enum_1.ErrorCategory.NOT_FOUND,
                severity: incident_severity_enum_1.IncidentSeverity.INFO,
                statusCode,
                retryable: false,
                operational: true,
            };
        }
        if (statusCode === 409) {
            return {
                category: error_category_enum_1.ErrorCategory.CONFLICT,
                severity: incident_severity_enum_1.IncidentSeverity.WARNING,
                statusCode,
                retryable: false,
                operational: true,
            };
        }
        if (statusCode === 429) {
            return {
                category: error_category_enum_1.ErrorCategory.RATE_LIMIT,
                severity: incident_severity_enum_1.IncidentSeverity.WARNING,
                statusCode,
                retryable: true,
                operational: true,
            };
        }
        if (statusCode === 408 ||
            statusCode === 504 ||
            this.containsAny(error, [
                "timeout",
                "timed out",
                "operationtimeouterror",
            ])) {
            return {
                category: error_category_enum_1.ErrorCategory.TIMEOUT,
                severity: incident_severity_enum_1.IncidentSeverity.ERROR,
                statusCode,
                retryable: true,
                operational: true,
            };
        }
        if (this.containsAny(error, [
            "prisma",
            "database",
            "postgres",
            "sql",
            "connection pool",
        ])) {
            return {
                category: error_category_enum_1.ErrorCategory.DATABASE,
                severity: incident_severity_enum_1.IncidentSeverity.CRITICAL,
                statusCode,
                retryable: true,
                operational: false,
            };
        }
        if (this.containsAny(error, [
            "fetch failed",
            "econnrefused",
            "enotfound",
            "external service",
            "upstream",
        ])) {
            return {
                category: error_category_enum_1.ErrorCategory.EXTERNAL_SERVICE,
                severity: incident_severity_enum_1.IncidentSeverity.ERROR,
                statusCode,
                retryable: true,
                operational: true,
            };
        }
        if (statusCode >= 500) {
            return {
                category: error_category_enum_1.ErrorCategory.INTERNAL,
                severity: incident_severity_enum_1.IncidentSeverity.ERROR,
                statusCode,
                retryable: false,
                operational: false,
            };
        }
        return {
            category: error_category_enum_1.ErrorCategory.UNKNOWN,
            severity: incident_severity_enum_1.IncidentSeverity.WARNING,
            statusCode,
            retryable: false,
            operational: true,
        };
    }
    containsAny(error, values) {
        const text = this.toSearchableText(error);
        return values.some((value) => text.includes(value.toLowerCase()));
    }
    toSearchableText(error) {
        if (error instanceof Error) {
            return `${error.name} ${error.message} ${error.stack ?? ""}`
                .toLowerCase();
        }
        try {
            return JSON.stringify(error).toLowerCase();
        }
        catch {
            return String(error).toLowerCase();
        }
    }
};
exports.ErrorClassificationService = ErrorClassificationService;
exports.ErrorClassificationService = ErrorClassificationService = __decorate([
    (0, common_1.Injectable)()
], ErrorClassificationService);
//# sourceMappingURL=error-classification.service.js.map