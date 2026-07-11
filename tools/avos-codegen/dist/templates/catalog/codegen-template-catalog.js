"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateCatalog = void 0;
const codegen_template_contracts_1 = require("../codegen-template.contracts");
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenTemplateCatalog {
    templates = new Map();
    register(template, replace = false) {
        const key = template.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Template catalog key is required");
        }
        if (this.templates.has(key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`Template catalog entry already exists: ${key}`);
        }
        this.templates.set(key, structuredClone(template));
        return structuredClone(template);
    }
    registerMany(templates, replace = false) {
        return templates.map((template) => this.register(template, replace));
    }
    get(key) {
        const template = this.templates.get(key);
        if (!template) {
            throw new codegen_errors_1.CodeGenValidationError(`Template catalog entry was not found: ${key}`);
        }
        return structuredClone(template);
    }
    find(key) {
        const template = this.templates.get(key);
        return template
            ? structuredClone(template)
            : undefined;
    }
    query(query = {}) {
        const normalizedText = query.text
            ?.trim()
            .toLowerCase();
        return Array.from(this.templates.values())
            .filter((template) => {
            if (query.status &&
                template.status !==
                    query.status) {
                return false;
            }
            if (query.type &&
                template.type !==
                    query.type) {
                return false;
            }
            if (query.tags?.length &&
                !query.tags.every((tag) => template.tags.includes(tag))) {
                return false;
            }
            if (normalizedText) {
                const searchable = [
                    template.key,
                    template.name,
                    template.description ?? "",
                    template.targetPath,
                    ...template.tags,
                ]
                    .join(" ")
                    .toLowerCase();
                if (!searchable.includes(normalizedText)) {
                    return false;
                }
            }
            return true;
        })
            .map((template) => structuredClone(template))
            .sort((left, right) => left.key.localeCompare(right.key));
    }
    listActive() {
        return this.query({
            status: codegen_template_contracts_1.CodeGenTemplateStatus.ACTIVE,
        });
    }
    remove(key) {
        const template = this.get(key);
        this.templates.delete(key);
        return template;
    }
    count() {
        return this.templates.size;
    }
    clear() {
        this.templates.clear();
    }
}
exports.CodeGenTemplateCatalog = CodeGenTemplateCatalog;
//# sourceMappingURL=codegen-template-catalog.js.map