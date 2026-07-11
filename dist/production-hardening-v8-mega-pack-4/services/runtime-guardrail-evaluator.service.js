"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeGuardrailEvaluatorService = void 0;
const common_1 = require("@nestjs/common");
let RuntimeGuardrailEvaluatorService = class RuntimeGuardrailEvaluatorService {
    evaluateConditions(conditions, context) {
        return conditions.every((condition) => this.evaluateCondition(condition, context));
    }
    evaluateCondition(condition, context) {
        const actual = this.resolvePath(context, condition.field);
        const expected = condition.value;
        switch (condition.operator) {
            case "exists":
                return expected === false
                    ? actual === undefined ||
                        actual === null
                    : actual !== undefined &&
                        actual !== null;
            case "eq":
                return this.equal(actual, expected);
            case "neq":
                return !this.equal(actual, expected);
            case "gt":
                return (Number(actual) >
                    Number(expected));
            case "gte":
                return (Number(actual) >=
                    Number(expected));
            case "lt":
                return (Number(actual) <
                    Number(expected));
            case "lte":
                return (Number(actual) <=
                    Number(expected));
            case "in":
                return Array.isArray(expected)
                    ? expected.some((item) => this.equal(actual, item))
                    : false;
            case "not_in":
                return Array.isArray(expected)
                    ? !expected.some((item) => this.equal(actual, item))
                    : true;
            case "contains":
                if (typeof actual ===
                    "string") {
                    return actual.includes(String(expected ?? ""));
                }
                if (Array.isArray(actual)) {
                    return actual.some((item) => this.equal(item, expected));
                }
                return false;
            default:
                return false;
        }
    }
    resolvePath(value, path) {
        const parts = path
            .split(".")
            .filter(Boolean);
        let current = value;
        for (const part of parts) {
            if (!current ||
                typeof current !==
                    "object") {
                return undefined;
            }
            current =
                current[part];
        }
        return current;
    }
    equal(actual, expected) {
        if (typeof actual ===
            "number" ||
            typeof expected ===
                "number") {
            const actualNumber = Number(actual);
            const expectedNumber = Number(expected);
            if (Number.isFinite(actualNumber) &&
                Number.isFinite(expectedNumber)) {
                return (actualNumber ===
                    expectedNumber);
            }
        }
        if (actual &&
            expected &&
            typeof actual ===
                "object" &&
            typeof expected ===
                "object") {
            return (JSON.stringify(actual) ===
                JSON.stringify(expected));
        }
        return actual === expected;
    }
};
exports.RuntimeGuardrailEvaluatorService = RuntimeGuardrailEvaluatorService;
exports.RuntimeGuardrailEvaluatorService = RuntimeGuardrailEvaluatorService = __decorate([
    (0, common_1.Injectable)()
], RuntimeGuardrailEvaluatorService);
//# sourceMappingURL=runtime-guardrail-evaluator.service.js.map