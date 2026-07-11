"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateHelperRegistry = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_template_value_utilities_1 = require("../utilities/codegen-template-value.utilities");
class CodeGenTemplateHelperRegistry {
    helpers = new Map();
    constructor() {
        this.registerDefaults();
    }
    register(key, helper, replace = false) {
        const normalizedKey = key.trim().toLowerCase();
        if (!normalizedKey) {
            throw new codegen_errors_1.CodeGenValidationError("Template helper key is required");
        }
        if (this.helpers.has(normalizedKey) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Template helper already exists: ${normalizedKey}`);
        }
        this.helpers.set(normalizedKey, helper);
    }
    execute(key, value, args = []) {
        const normalizedKey = key.trim().toLowerCase();
        const helper = this.helpers.get(normalizedKey);
        if (!helper) {
            throw new codegen_errors_1.CodeGenValidationError(`Template helper was not found: ${normalizedKey}`);
        }
        return helper(value, args);
    }
    has(key) {
        return this.helpers.has(key.trim().toLowerCase());
    }
    list() {
        return Array.from(this.helpers.keys()).sort();
    }
    registerDefaults() {
        this.register("pascalCase", (value) => (0, codegen_template_value_utilities_1.toPascalCase)((0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)));
        this.register("camelCase", (value) => (0, codegen_template_value_utilities_1.toCamelCase)((0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)));
        this.register("kebabCase", (value) => (0, codegen_template_value_utilities_1.toKebabCase)((0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)));
        this.register("snakeCase", (value) => (0, codegen_template_value_utilities_1.toSnakeCase)((0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)));
        this.register("constantCase", (value) => (0, codegen_template_value_utilities_1.toConstantCase)((0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)));
        this.register("titleCase", (value) => (0, codegen_template_value_utilities_1.toTitleCase)((0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)));
        this.register("upper", (value) => (0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)
            .toUpperCase());
        this.register("lower", (value) => (0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)
            .toLowerCase());
        this.register("trim", (value) => (0, codegen_template_value_utilities_1.stringifyTemplateValue)(value)
            .trim());
        this.register("json", (value) => JSON.stringify(value ?? null, null, 2));
        this.register("indent", (value, args) => (0, codegen_template_value_utilities_1.indentText)((0, codegen_template_value_utilities_1.stringifyTemplateValue)(value), Number(args[0] ?? "2")));
        this.register("default", (value, args) => {
            const rendered = (0, codegen_template_value_utilities_1.stringifyTemplateValue)(value);
            return rendered ||
                args.join(" ");
        });
    }
}
exports.CodeGenTemplateHelperRegistry = CodeGenTemplateHelperRegistry;
//# sourceMappingURL=codegen-template-helper-registry.js.map