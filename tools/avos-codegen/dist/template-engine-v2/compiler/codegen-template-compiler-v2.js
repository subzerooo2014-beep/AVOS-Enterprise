"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateCompilerV2 = void 0;
const codegen_template_v2_contracts_1 = require("../contracts/codegen-template-v2.contracts");
const codegen_template_cache_v2_1 = require("../cache/codegen-template-cache-v2");
const codegen_template_parser_v2_1 = require("../parser/codegen-template-parser-v2");
const codegen_template_tokenizer_v2_1 = require("../parser/codegen-template-tokenizer-v2");
const codegen_template_renderer_v2_1 = require("../runtime/codegen-template-renderer-v2");
const codegen_template_validator_v2_1 = require("../validation/codegen-template-validator-v2");
class CodeGenTemplateCompilerV2 {
    tokenizer;
    parser;
    validator;
    renderer;
    cache;
    constructor(tokenizer = new codegen_template_tokenizer_v2_1.CodeGenTemplateTokenizerV2(), parser = new codegen_template_parser_v2_1.CodeGenTemplateParserV2(), validator = new codegen_template_validator_v2_1.CodeGenTemplateValidatorV2(), renderer = new codegen_template_renderer_v2_1.CodeGenTemplateRendererV2(), cache = new codegen_template_cache_v2_1.CodeGenTemplateCacheV2()) {
        this.tokenizer = tokenizer;
        this.parser = parser;
        this.validator = validator;
        this.renderer = renderer;
        this.cache = cache;
    }
    compile(request) {
        const startedAt = new Date().toISOString();
        const tokens = this.tokenizer.tokenize(request.source);
        const diagnostics = this.validator.validate(tokens);
        const hasErrors = diagnostics.some((diagnostic) => diagnostic.severity ===
            codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR);
        let ast = this.cache.get(request.templateKey, request.source);
        if (!ast) {
            ast =
                this.parser.parse(tokens);
            this.cache.put(request.templateKey, request.source, ast);
        }
        let output = "";
        if (!hasErrors) {
            try {
                output =
                    this.renderer.render(ast, request.variables, {
                        strict: request.strict,
                        preserveComments: request.preserveComments,
                    });
            }
            catch (error) {
                diagnostics.push({
                    code: "TEMPLATE_RENDER_FAILED",
                    severity: codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR,
                    message: error instanceof Error
                        ? error.message
                        : String(error),
                });
            }
        }
        const completedAt = new Date().toISOString();
        return {
            success: !diagnostics.some((diagnostic) => diagnostic.severity ===
                codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR),
            templateKey: request.templateKey,
            output,
            tokens,
            ast,
            diagnostics,
            startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(startedAt),
        };
    }
}
exports.CodeGenTemplateCompilerV2 = CodeGenTemplateCompilerV2;
//# sourceMappingURL=codegen-template-compiler-v2.js.map