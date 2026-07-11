"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateTokenType = exports.CodeGenTemplateSourceType = exports.CodeGenTemplateStatus = exports.CodeGenTemplateType = void 0;
var CodeGenTemplateType;
(function (CodeGenTemplateType) {
    CodeGenTemplateType["FILE"] = "file";
    CodeGenTemplateType["DIRECTORY"] = "directory";
    CodeGenTemplateType["PARTIAL"] = "partial";
    CodeGenTemplateType["FRAGMENT"] = "fragment";
    CodeGenTemplateType["DOCUMENTATION"] = "documentation";
    CodeGenTemplateType["CUSTOM"] = "custom";
})(CodeGenTemplateType || (exports.CodeGenTemplateType = CodeGenTemplateType = {}));
var CodeGenTemplateStatus;
(function (CodeGenTemplateStatus) {
    CodeGenTemplateStatus["DRAFT"] = "draft";
    CodeGenTemplateStatus["ACTIVE"] = "active";
    CodeGenTemplateStatus["DISABLED"] = "disabled";
    CodeGenTemplateStatus["ARCHIVED"] = "archived";
})(CodeGenTemplateStatus || (exports.CodeGenTemplateStatus = CodeGenTemplateStatus = {}));
var CodeGenTemplateSourceType;
(function (CodeGenTemplateSourceType) {
    CodeGenTemplateSourceType["INLINE"] = "inline";
    CodeGenTemplateSourceType["FILESYSTEM"] = "filesystem";
    CodeGenTemplateSourceType["PLUGIN"] = "plugin";
    CodeGenTemplateSourceType["MARKETPLACE"] = "marketplace";
})(CodeGenTemplateSourceType || (exports.CodeGenTemplateSourceType = CodeGenTemplateSourceType = {}));
var CodeGenTemplateTokenType;
(function (CodeGenTemplateTokenType) {
    CodeGenTemplateTokenType["TEXT"] = "text";
    CodeGenTemplateTokenType["VARIABLE"] = "variable";
    CodeGenTemplateTokenType["RAW_VARIABLE"] = "raw_variable";
    CodeGenTemplateTokenType["HELPER"] = "helper";
    CodeGenTemplateTokenType["PARTIAL"] = "partial";
    CodeGenTemplateTokenType["IF_OPEN"] = "if_open";
    CodeGenTemplateTokenType["UNLESS_OPEN"] = "unless_open";
    CodeGenTemplateTokenType["EACH_OPEN"] = "each_open";
    CodeGenTemplateTokenType["ELSE"] = "else";
    CodeGenTemplateTokenType["BLOCK_CLOSE"] = "block_close";
})(CodeGenTemplateTokenType || (exports.CodeGenTemplateTokenType = CodeGenTemplateTokenType = {}));
//# sourceMappingURL=codegen-template.contracts.js.map