"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3FieldRenderer = void 0;
class CodeGenGeneratorV3FieldRenderer {
    renderDtoField(field) {
        const decorators = this.dtoDecorators(field);
        const optionalMark = field.required
            ? "!"
            : "?";
        return `${decorators.join("\n")}
  ${field.name}${optionalMark}: ${this.typescriptType(field.type)};`;
    }
    renderPrismaField(field) {
        const optionalMark = field.required
            ? ""
            : "?";
        const attributes = [];
        if (field.unique) {
            attributes.push("@unique");
        }
        if (field.defaultValue !==
            undefined) {
            attributes.push(`@default(${this.prismaDefault(field.defaultValue)})`);
        }
        return `  ${field.name} ${this.prismaType(field.type)}${optionalMark}${attributes.length > 0 ? ` ${attributes.join(" ")}` : ""}`;
    }
    dtoDecorators(field) {
        const decorators = [];
        if (!field.required) {
            decorators.push("  @IsOptional()");
        }
        switch (field.type) {
            case "number":
            case "decimal":
            case "bigint":
                decorators.push("  @IsNumber()");
                break;
            case "boolean":
                decorators.push("  @IsBoolean()");
                break;
            case "date":
                decorators.push("  @IsISO8601()");
                break;
            case "json":
                decorators.push("  @IsObject()");
                break;
            case "string":
            default:
                decorators.push("  @IsString()");
                if (field.maxLength !==
                    undefined) {
                    decorators.push(`  @MaxLength(${field.maxLength})`);
                }
                break;
        }
        return decorators;
    }
    typescriptType(type) {
        switch (type) {
            case "number":
            case "decimal":
            case "bigint":
                return "number";
            case "boolean":
                return "boolean";
            case "date":
                return "string";
            case "json":
                return "Record<string, unknown>";
            case "string":
            default:
                return "string";
        }
    }
    prismaType(type) {
        switch (type) {
            case "number":
                return "Int";
            case "decimal":
                return "Decimal";
            case "bigint":
                return "BigInt";
            case "boolean":
                return "Boolean";
            case "date":
                return "DateTime";
            case "json":
                return "Json";
            case "string":
            default:
                return "String";
        }
    }
    prismaDefault(value) {
        if (typeof value === "string") {
            return `"${value.replaceAll('"', '\\"')}"`;
        }
        return String(value);
    }
}
exports.CodeGenGeneratorV3FieldRenderer = CodeGenGeneratorV3FieldRenderer;
//# sourceMappingURL=codegen-generator-v3-field-renderer.js.map