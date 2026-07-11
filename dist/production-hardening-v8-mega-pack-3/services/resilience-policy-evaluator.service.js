"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResiliencePolicyEvaluatorService = void 0;
const common_1 = require("@nestjs/common");
let ResiliencePolicyEvaluatorService = class ResiliencePolicyEvaluatorService {
    evaluateConditions(conditions, context) {
        return conditions.every((condition) => this.evaluateCondition(condition, context));
    }
    evaluateCondition(condition, context) {
        const actual = this.resolvePath(context, condition.field);
        const expected = condition.value;
        switch (condition.operator) {
            case "exists":
                return expected === false
                    ? actual === undefined || actual === null
                    : actual !== undefined && actual !== null;
            case "eq":
                return this.isEqual(actual, expected);
            case "neq":
                return !this.isEqual(actual, expected);
            case "gt":
                return this.toNumber(actual) > this.toNumber(expected);
            case "gte":
                return this.toNumber(actual) >= this.toNumber(expected);
            case "lt":
                return this.toNumber(actual) < this.toNumber(expected);
            case "lte":
                return this.toNumber(actual) <= this.toNumber(expected);
            case "in":
                return Array.isArray(expected)
                    ? expected.some((value) => this.isEqual(actual, value))
                    : false;
            case "not_in":
                return Array.isArray(expected)
                    ? !expected.some((value) => this.isEqual(actual, value))
                    : true;
            case "contains":
                if (typeof actual === "string") {
                    return actual.includes(String(expected ?? ""));
                }
                if (Array.isArray(actual)) {
                    return actual.some((item) => this.isEqual(item, expected));
                }
                return false;
            default:
                return false;
        }
    }
    resolvePath(object, path) {
        const parts = path.split(".").filter(Boolean);
        let current = object;
        for (const part of parts) {
            if (current === null ||
                current === undefined ||
                typeof current !== "object") {
                return undefined;
            }
            current = current[part];
        }
        return current;
    }
    toNumber(value) {
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            return Number.NaN;
        }
        return numberValue;
    }
    isEqual(actual, expected) {
        if (typeof actual === "number" ||
            typeof expected === "number") {
            const actualNumber = Number(actual);
            const expectedNumber = Number(expected);
            if (Number.isFinite(actualNumber) &&
                Number.isFinite(expectedNumber)) {
                return actualNumber === expectedNumber;
            }
        }
        if (typeof actual === "object" &&
            actual !== null &&
            typeof expected === "object" &&
            expected !== null) {
            return JSON.stringify(actual) === JSON.stringify(expected);
        }
        return actual === expected;
    }
};
exports.ResiliencePolicyEvaluatorService = ResiliencePolicyEvaluatorService;
exports.ResiliencePolicyEvaluatorService = ResiliencePolicyEvaluatorService = __decorate([
    (0, common_1.Injectable)()
], ResiliencePolicyEvaluatorService);
//# sourceMappingURL=resilience-policy-evaluator.service.js.map