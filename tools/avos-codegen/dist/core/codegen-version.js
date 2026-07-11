"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVOS_CODEGEN_VERSION = void 0;
exports.formatCodeGenVersion = formatCodeGenVersion;
exports.parseCodeGenVersion = parseCodeGenVersion;
const codegen_errors_1 = require("./codegen.errors");
exports.AVOS_CODEGEN_VERSION = {
    major: 1,
    minor: 0,
    patch: 0,
    prerelease: "alpha.1",
};
function formatCodeGenVersion(version) {
    const base = `${version.major}.` +
        `${version.minor}.` +
        `${version.patch}`;
    return version.prerelease
        ? `${base}-${version.prerelease}`
        : base;
}
function parseCodeGenVersion(value) {
    const match = /^(\d+)\.(\d+)\.(\d+)(?:-([A-Za-z0-9.-]+))?$/
        .exec(value.trim());
    if (!match) {
        throw new codegen_errors_1.CodeGenValidationError(`Invalid semantic version: ${value}`);
    }
    const major = Number(match[1]);
    const minor = Number(match[2]);
    const patch = Number(match[3]);
    const prerelease = match[4];
    return {
        major,
        minor,
        patch,
        ...(prerelease
            ? { prerelease }
            : {}),
    };
}
//# sourceMappingURL=codegen-version.js.map