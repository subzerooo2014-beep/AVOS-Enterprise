"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleRegistry = void 0;
class RuleRegistry {
    rules = [];
    register(rule) {
        this.rules.push(rule);
    }
    resolve(input) {
        return this.rules.filter((rule) => rule.supports(input));
    }
}
exports.RuleRegistry = RuleRegistry;
