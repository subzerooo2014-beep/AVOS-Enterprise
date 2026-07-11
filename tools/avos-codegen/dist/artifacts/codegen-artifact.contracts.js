"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenArtifactStatus = exports.CodeGenArtifactType = void 0;
var CodeGenArtifactType;
(function (CodeGenArtifactType) {
    CodeGenArtifactType["SOURCE"] = "source";
    CodeGenArtifactType["TEST"] = "test";
    CodeGenArtifactType["DOCUMENTATION"] = "documentation";
    CodeGenArtifactType["CONFIGURATION"] = "configuration";
    CodeGenArtifactType["MANIFEST"] = "manifest";
    CodeGenArtifactType["SCHEMA"] = "schema";
    CodeGenArtifactType["MIGRATION"] = "migration";
    CodeGenArtifactType["ASSET"] = "asset";
    CodeGenArtifactType["CUSTOM"] = "custom";
})(CodeGenArtifactType || (exports.CodeGenArtifactType = CodeGenArtifactType = {}));
var CodeGenArtifactStatus;
(function (CodeGenArtifactStatus) {
    CodeGenArtifactStatus["PLANNED"] = "planned";
    CodeGenArtifactStatus["READY"] = "ready";
    CodeGenArtifactStatus["BLOCKED"] = "blocked";
    CodeGenArtifactStatus["GENERATED"] = "generated";
    CodeGenArtifactStatus["WRITTEN"] = "written";
    CodeGenArtifactStatus["SKIPPED"] = "skipped";
    CodeGenArtifactStatus["FAILED"] = "failed";
    CodeGenArtifactStatus["ROLLED_BACK"] = "rolled_back";
})(CodeGenArtifactStatus || (exports.CodeGenArtifactStatus = CodeGenArtifactStatus = {}));
//# sourceMappingURL=codegen-artifact.contracts.js.map