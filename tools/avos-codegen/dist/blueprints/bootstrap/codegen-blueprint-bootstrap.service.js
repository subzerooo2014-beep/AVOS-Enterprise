"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintBootstrapService = void 0;
const node_path_1 = require("node:path");
const codegen_blueprint_runtime_discovery_1 = require("../runtime/codegen-blueprint-runtime-discovery");
const codegen_blueprint_runtime_registry_1 = require("../runtime/codegen-blueprint-runtime-registry");
const codegen_template_engine_1 = require("../../templates/codegen-template-engine");
class CodeGenBlueprintBootstrapService {
    blueprintRegistry;
    templateEngine;
    constructor(blueprintRegistry = new codegen_blueprint_runtime_registry_1.CodeGenBlueprintRuntimeRegistry(), templateEngine = new codegen_template_engine_1.CodeGenTemplateEngine()) {
        this.blueprintRegistry = blueprintRegistry;
        this.templateEngine = templateEngine;
    }
    async initialize(input) {
        const templatesRoot = (0, node_path_1.resolve)(input.codegenRoot, "templates");
        const blueprintsRoot = (0, node_path_1.resolve)(input.codegenRoot, "blueprints");
        const templateResult = await this.templateEngine.loadDirectory(templatesRoot, input.replace ?? false);
        const discovery = new codegen_blueprint_runtime_discovery_1.CodeGenBlueprintRuntimeDiscovery(this.blueprintRegistry);
        const blueprintResult = await discovery.discoverDirectory(blueprintsRoot, input.replace ?? false);
        return {
            blueprints: blueprintResult.registered,
            templates: templateResult.templates,
            warnings: [
                ...templateResult.warnings,
                ...blueprintResult.warnings,
                ...blueprintResult.errors,
            ],
            initializedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenBlueprintBootstrapService = CodeGenBlueprintBootstrapService;
//# sourceMappingURL=codegen-blueprint-bootstrap.service.js.map