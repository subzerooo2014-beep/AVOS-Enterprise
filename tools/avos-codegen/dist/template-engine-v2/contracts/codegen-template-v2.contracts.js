"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateDiagnosticSeverity = exports.CodeGenTemplateAstNodeType = exports.CodeGenTemplateTokenType = void 0;
var CodeGenTemplateTokenType;
(function (CodeGenTemplateTokenType) {
    CodeGenTemplateTokenType["TEXT"] = "text";
    CodeGenTemplateTokenType["INTERPOLATION"] = "interpolation";
    CodeGenTemplateTokenType["IF_OPEN"] = "if_open";
    CodeGenTemplateTokenType["IF_CLOSE"] = "if_close";
    CodeGenTemplateTokenType["EACH_OPEN"] = "each_open";
    CodeGenTemplateTokenType["EACH_CLOSE"] = "each_close";
    CodeGenTemplateTokenType["COMMENT"] = "comment";
})(CodeGenTemplateTokenType || (exports.CodeGenTemplateTokenType = CodeGenTemplateTokenType = {}));
var CodeGenTemplateAstNodeType;
(function (CodeGenTemplateAstNodeType) {
    CodeGenTemplateAstNodeType["DOCUMENT"] = "document";
    CodeGenTemplateAstNodeType["TEXT"] = "text";
    CodeGenTemplateAstNodeType["INTERPOLATION"] = "interpolation";
    CodeGenTemplateAstNodeType["IF"] = "if";
    CodeGenTemplateAstNodeType["EACH"] = "each";
    CodeGenTemplateAstNodeType["COMMENT"] = "comment";
})(CodeGenTemplateAstNodeType || (exports.CodeGenTemplateAstNodeType = CodeGenTemplateAstNodeType = {}));
var CodeGenTemplateDiagnosticSeverity;
(function (CodeGenTemplateDiagnosticSeverity) {
    CodeGenTemplateDiagnosticSeverity["INFORMATIONAL"] = "informational";
    CodeGenTemplateDiagnosticSeverity["WARNING"] = "warning";
    CodeGenTemplateDiagnosticSeverity["ERROR"] = "error";
})(CodeGenTemplateDiagnosticSeverity || (exports.CodeGenTemplateDiagnosticSeverity = CodeGenTemplateDiagnosticSeverity = {}));
//# sourceMappingURL=codegen-template-v2.contracts.js.map