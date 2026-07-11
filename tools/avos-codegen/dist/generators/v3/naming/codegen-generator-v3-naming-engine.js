"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3NamingEngine = void 0;
class CodeGenGeneratorV3NamingEngine {
    create(request) {
        const moduleName = request.moduleName.trim();
        const entityName = request.entityName?.trim() ||
            moduleName;
        const routeName = request.routeName?.trim() ||
            this.toKebabCase(moduleName);
        return {
            moduleName,
            entityName,
            routeName,
            pascalModule: this.toPascalCase(moduleName),
            pascalEntity: this.toPascalCase(entityName),
            camelModule: this.toCamelCase(moduleName),
            camelEntity: this.toCamelCase(entityName),
            kebabModule: this.toKebabCase(moduleName),
            kebabEntity: this.toKebabCase(entityName),
            constantModule: this.toConstantCase(moduleName),
        };
    }
    toWords(value) {
        return value
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/[^A-Za-z0-9]+/g, " ")
            .trim()
            .split(/\s+/)
            .filter(Boolean);
    }
    toPascalCase(value) {
        return this.toWords(value)
            .map((word) => word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase())
            .join("");
    }
    toCamelCase(value) {
        const pascal = this.toPascalCase(value);
        return pascal
            ? pascal.charAt(0).toLowerCase() +
                pascal.slice(1)
            : "";
    }
    toKebabCase(value) {
        return this.toWords(value)
            .map((word) => word.toLowerCase())
            .join("-");
    }
    toConstantCase(value) {
        return this.toWords(value)
            .map((word) => word.toUpperCase())
            .join("_");
    }
}
exports.CodeGenGeneratorV3NamingEngine = CodeGenGeneratorV3NamingEngine;
//# sourceMappingURL=codegen-generator-v3-naming-engine.js.map