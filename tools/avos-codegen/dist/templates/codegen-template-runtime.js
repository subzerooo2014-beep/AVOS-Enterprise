"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateRuntime = void 0;
const codegen_template_engine_1 = require("./codegen-template-engine");
class CodeGenTemplateRuntime {
    engine;
    initialized = false;
    initializedAt;
    constructor(engine = new codegen_template_engine_1.CodeGenTemplateEngine()) {
        this.engine = engine;
    }
    async initialize(input) {
        const result = await this.engine.loadDirectory(input.templateRoot, input.replace ?? false);
        this.initialized = true;
        this.initializedAt =
            new Date().toISOString();
        return result;
    }
    render(input) {
        return this.engine.render(input.templateKey, {
            variables: input.variables,
            strict: input.strict ?? true,
            ...(input.partials
                ? {
                    partials: input.partials,
                }
                : {}),
        });
    }
    renderMany(templateKeys, variables, strict = true) {
        return this.engine.renderMany(templateKeys, {
            variables,
            strict,
        });
    }
    snapshot() {
        return {
            initialized: this.initialized,
            ...(this.initializedAt
                ? {
                    initializedAt: this.initializedAt,
                }
                : {}),
            engine: this.engine.snapshot(),
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenTemplateRuntime = CodeGenTemplateRuntime;
//# sourceMappingURL=codegen-template-runtime.js.map