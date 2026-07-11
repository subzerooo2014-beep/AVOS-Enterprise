"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTemplateValue = resolveTemplateValue;
exports.stringifyTemplateValue = stringifyTemplateValue;
exports.isTruthyTemplateValue = isTruthyTemplateValue;
exports.escapeHtml = escapeHtml;
exports.toWords = toWords;
exports.toPascalCase = toPascalCase;
exports.toCamelCase = toCamelCase;
exports.toKebabCase = toKebabCase;
exports.toSnakeCase = toSnakeCase;
exports.toConstantCase = toConstantCase;
exports.toTitleCase = toTitleCase;
exports.indentText = indentText;
function resolveTemplateValue(variables, path) {
    const normalized = path.trim();
    if (normalized === "." ||
        normalized === "this") {
        return variables["this"];
    }
    const parts = normalized
        .split(".")
        .map((part) => part.trim())
        .filter(Boolean);
    let current = variables;
    for (const part of parts) {
        if (current === null ||
            typeof current !== "object" ||
            Array.isArray(current)) {
            return undefined;
        }
        current = current[part];
    }
    return current;
}
function stringifyTemplateValue(value) {
    if (value === undefined ||
        value === null) {
        return "";
    }
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" ||
        typeof value === "boolean") {
        return String(value);
    }
    return JSON.stringify(value, null, 2);
}
function isTruthyTemplateValue(value) {
    if (value === undefined ||
        value === null ||
        value === false ||
        value === "" ||
        value === 0) {
        return false;
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    if (typeof value === "object") {
        return Object.keys(value).length > 0;
    }
    return true;
}
function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
function toWords(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[^A-Za-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}
function toPascalCase(value) {
    return toWords(value)
        .map((word) => word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase())
        .join("");
}
function toCamelCase(value) {
    const pascal = toPascalCase(value);
    return pascal
        ? pascal.charAt(0).toLowerCase() +
            pascal.slice(1)
        : "";
}
function toKebabCase(value) {
    return toWords(value)
        .map((word) => word.toLowerCase())
        .join("-");
}
function toSnakeCase(value) {
    return toWords(value)
        .map((word) => word.toLowerCase())
        .join("_");
}
function toConstantCase(value) {
    return toWords(value)
        .map((word) => word.toUpperCase())
        .join("_");
}
function toTitleCase(value) {
    return toWords(value)
        .map((word) => word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase())
        .join(" ");
}
function indentText(value, size) {
    const spaces = " ".repeat(Math.max(0, size));
    return value
        .split(/\r?\n/)
        .map((line) => line.length > 0
        ? `${spaces}${line}`
        : line)
        .join("\n");
}
//# sourceMappingURL=codegen-template-value.utilities.js.map