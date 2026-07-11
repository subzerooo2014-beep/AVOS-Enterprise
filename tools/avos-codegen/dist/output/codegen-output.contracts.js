"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenConflictType = exports.CodeGenConflictPolicy = void 0;
var CodeGenConflictPolicy;
(function (CodeGenConflictPolicy) {
    CodeGenConflictPolicy["ERROR"] = "error";
    CodeGenConflictPolicy["SKIP"] = "skip";
    CodeGenConflictPolicy["OVERWRITE"] = "overwrite";
    CodeGenConflictPolicy["OVERWRITE_IF_UNCHANGED"] = "overwrite_if_unchanged";
})(CodeGenConflictPolicy || (exports.CodeGenConflictPolicy = CodeGenConflictPolicy = {}));
var CodeGenConflictType;
(function (CodeGenConflictType) {
    CodeGenConflictType["NONE"] = "none";
    CodeGenConflictType["FILE_EXISTS"] = "file_exists";
    CodeGenConflictType["CONTENT_CHANGED"] = "content_changed";
    CodeGenConflictType["PATH_OUTSIDE_TARGET"] = "path_outside_target";
    CodeGenConflictType["LOCKED"] = "locked";
})(CodeGenConflictType || (exports.CodeGenConflictType = CodeGenConflictType = {}));
//# sourceMappingURL=codegen-output.contracts.js.map