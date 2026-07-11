"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKebabCase = isKebabCase;
exports.isPascalCase = isPascalCase;
exports.isCamelCase = isCamelCase;
exports.filenameWithoutExtensions = filenameWithoutExtensions;
exports.pathFilename = pathFilename;
function isKebabCase(value) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
function isPascalCase(value) {
    return /^[A-Z][A-Za-z0-9]*$/.test(value);
}
function isCamelCase(value) {
    return /^[a-z][A-Za-z0-9]*$/.test(value);
}
function filenameWithoutExtensions(value) {
    return value
        .replace(/\.d\.ts$/, "")
        .replace(/\.[^.]+$/, "");
}
function pathFilename(relativePath) {
    const normalized = relativePath.replaceAll("\\", "/");
    return normalized
        .split("/")
        .filter(Boolean)
        .pop() ?? "";
}
//# sourceMappingURL=codegen-naming.utilities.js.map