"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateEngine = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_errors_1 = require("../core/codegen.errors");
const codegen_template_contracts_1 = require("./codegen-template.contracts");
const codegen_template_cache_1 = require("./cache/codegen-template-cache");
const codegen_template_catalog_1 = require("./catalog/codegen-template-catalog");
const codegen_template_compiler_1 = require("./compiler/codegen-template-compiler");
const codegen_template_renderer_1 = require("./compiler/codegen-template-renderer");
const codegen_template_loader_1 = require("./loading/codegen-template-loader");
class CodeGenTemplateEngine {
    catalog;
    compiler;
    renderer;
    loader;
    cache;
    constructor(catalog = new codegen_template_catalog_1.CodeGenTemplateCatalog(), compiler = new codegen_template_compiler_1.CodeGenTemplateCompiler(), renderer = new codegen_template_renderer_1.CodeGenTemplateRenderer(), loader = new codegen_template_loader_1.CodeGenTemplateLoader(), cache = new codegen_template_cache_1.CodeGenTemplateCache()) {
        this.catalog = catalog;
        this.compiler = compiler;
        this.renderer = renderer;
        this.loader = loader;
        this.cache = cache;
    }
    create(input) {
        const key = input.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Template key is required");
        }
        if (this.catalog.find(key)) {
            throw new codegen_errors_1.CodeGenValidationError(`Template already exists: ${key}`);
        }
        const now = new Date().toISOString();
        const template = {
            id: (0, node_crypto_1.randomUUID)(),
            key,
            name: input.name.trim(),
            ...(input.description
                ? {
                    description: input.description,
                }
                : {}),
            type: input.type ??
                codegen_template_contracts_1.CodeGenTemplateType.FILE,
            status: codegen_template_contracts_1.CodeGenTemplateStatus.ACTIVE,
            version: structuredClone(input.version),
            targetPath: input.targetPath,
            content: input.content,
            variables: structuredClone(input.variables ?? []),
            tags: Array.from(new Set(input.tags ?? [])),
            metadata: structuredClone(input.metadata ?? {}),
            createdAt: now,
            updatedAt: now,
        };
        this.catalog.register(template);
        return structuredClone(template);
    }
    register(template, replace = false) {
        if (replace) {
            this.cache.remove(template.key);
        }
        return this.catalog.register(template, replace);
    }
    async loadManifest(manifestPath, replace = false) {
        const loaded = await this.loader.loadManifest(manifestPath);
        return this.registerLoaded(loaded, replace);
    }
    async loadDirectory(rootPath, replace = false) {
        const result = await this.loader.loadDirectory(rootPath);
        const templates = result.loaded.map((loaded) => this.registerLoaded(loaded, replace));
        return {
            templates,
            warnings: result.warnings,
        };
    }
    get(key) {
        return this.catalog.get(key);
    }
    find(key) {
        return this.catalog.find(key);
    }
    list() {
        return this.catalog.query();
    }
    compile(key) {
        const template = this.get(key);
        const checksum = this.compiler.checksum(template.content);
        const cached = this.cache.get(template.key, checksum);
        if (cached) {
            return cached;
        }
        const compiled = this.compiler.compile({
            key: template.key,
            source: template.content,
        });
        return this.cache.set(compiled);
    }
    render(key, context) {
        const template = this.get(key);
        if (template.status !==
            codegen_template_contracts_1.CodeGenTemplateStatus.ACTIVE) {
            throw new codegen_errors_1.CodeGenValidationError(`Template is not active: ${key}`);
        }
        const variables = this.applyDefaults(template, context);
        this.validateRequiredVariables(template, variables, context.strict);
        const compiled = this.compile(key);
        const rendered = this.renderer.render(compiled, {
            ...context,
            variables,
        });
        const targetPath = this.renderer.renderString(`${key}:target-path`, template.targetPath, {
            ...context,
            variables,
        });
        return {
            templateKey: template.key,
            targetPath,
            content: rendered.content,
            checksum: this.compiler.checksum(rendered.content),
            diagnostics: rendered.diagnostics,
            renderedAt: new Date().toISOString(),
        };
    }
    renderMany(keys, context) {
        return keys.map((key) => this.render(key, context));
    }
    remove(key) {
        this.cache.remove(key);
        return this.catalog.remove(key);
    }
    clear() {
        this.catalog.clear();
        this.cache.clear();
    }
    snapshot() {
        return {
            templates: this.catalog.count(),
            activeTemplates: this.catalog
                .listActive()
                .length,
            cache: this.cache.snapshot(),
            generatedAt: new Date().toISOString(),
        };
    }
    registerLoaded(loaded, replace) {
        return this.register(loaded.definition, replace);
    }
    applyDefaults(template, context) {
        const variables = structuredClone(context.variables);
        for (const variable of template.variables) {
            if (variables[variable.key] === undefined &&
                variable.defaultValue !==
                    undefined) {
                variables[variable.key] =
                    structuredClone(variable.defaultValue);
            }
        }
        return variables;
    }
    validateRequiredVariables(template, variables, strict) {
        if (!strict) {
            return;
        }
        const missing = template.variables
            .filter((variable) => variable.required &&
            variables[variable.key] === undefined)
            .map((variable) => variable.key);
        if (missing.length > 0) {
            throw new codegen_errors_1.CodeGenValidationError(`Required template variables are missing for ${template.key}: ${missing.join(", ")}`);
        }
    }
}
exports.CodeGenTemplateEngine = CodeGenTemplateEngine;
//# sourceMappingURL=codegen-template-engine.js.map