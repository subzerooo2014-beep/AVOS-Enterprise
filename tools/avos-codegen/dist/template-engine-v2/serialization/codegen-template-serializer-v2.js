"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateSerializerV2 = void 0;
class CodeGenTemplateSerializerV2 {
    serializeAst(ast) {
        return JSON.stringify(ast, null, 2);
    }
    deserializeAst(value) {
        return JSON.parse(value);
    }
    serializeResult(result) {
        return JSON.stringify(result, null, 2);
    }
}
exports.CodeGenTemplateSerializerV2 = CodeGenTemplateSerializerV2;
//# sourceMappingURL=codegen-template-serializer-v2.js.map