"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodeGenCliBootstrap = createCodeGenCliBootstrap;
const node_path_1 = require("node:path");
const codegen_blueprint_bootstrap_service_1 = require("../../blueprints/bootstrap/codegen-blueprint-bootstrap.service");
const codegen_unified_generation_service_1 = require("../../generation/codegen-unified-generation.service");
function createCodeGenCliBootstrap(codegenRoot = process.cwd()) {
    return {
        codegenRoot: (0, node_path_1.resolve)(codegenRoot),
        bootstrap: new codegen_blueprint_bootstrap_service_1.CodeGenBlueprintBootstrapService(),
        generation: new codegen_unified_generation_service_1.CodeGenUnifiedGenerationService(),
    };
}
//# sourceMappingURL=codegen-cli-bootstrap.js.map