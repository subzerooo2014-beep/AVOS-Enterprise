"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateLoader = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_template_contracts_1 = require("../codegen-template.contracts");
class CodeGenTemplateLoader {
    async loadManifest(manifestPath, options = {}) {
        const absoluteManifestPath = (0, node_path_1.resolve)(manifestPath);
        const rawManifest = await (0, promises_1.readFile)(absoluteManifestPath, "utf8");
        const parsed = JSON.parse(rawManifest);
        const manifest = this.validateManifest(parsed, absoluteManifestPath);
        const manifestDirectory = (0, node_path_1.dirname)(absoluteManifestPath);
        const absoluteTemplatePath = (0, node_path_1.isAbsolute)(manifest.templateFile)
            ? manifest.templateFile
            : (0, node_path_1.resolve)(manifestDirectory, manifest.templateFile);
        const encoding = options.encoding ?? "utf8";
        const content = await (0, promises_1.readFile)(absoluteTemplatePath, encoding);
        const checksum = (0, node_crypto_1.createHash)("sha256")
            .update(content)
            .digest("hex");
        const fileStat = await (0, promises_1.stat)(absoluteTemplatePath);
        const now = new Date().toISOString();
        const sourceRoot = options.replaceRoot
            ? (0, node_path_1.resolve)(options.replaceRoot)
            : manifestDirectory;
        const definition = {
            id: (0, node_crypto_1.randomUUID)(),
            key: manifest.key.trim(),
            name: manifest.name.trim(),
            ...(manifest.description
                ? {
                    description: manifest.description,
                }
                : {}),
            type: manifest.type ??
                codegen_template_contracts_1.CodeGenTemplateType.FILE,
            status: manifest.status ??
                codegen_template_contracts_1.CodeGenTemplateStatus.ACTIVE,
            version: structuredClone(manifest.version),
            targetPath: manifest.targetPath,
            content,
            variables: structuredClone(manifest.variables ?? []),
            tags: Array.from(new Set(manifest.tags ?? [])),
            metadata: structuredClone(manifest.metadata ?? {}),
            source: {
                type: codegen_template_contracts_1.CodeGenTemplateSourceType.FILESYSTEM,
                absolutePath: absoluteTemplatePath,
                relativePath: (0, node_path_1.relative)(sourceRoot, absoluteTemplatePath),
                encoding,
                checksum,
                loadedAt: now,
            },
            createdAt: fileStat.birthtime.toISOString(),
            updatedAt: fileStat.mtime.toISOString(),
        };
        return {
            definition,
            manifestPath: absoluteManifestPath,
            templatePath: absoluteTemplatePath,
            checksum,
        };
    }
    async loadDirectory(rootPath) {
        const absoluteRoot = (0, node_path_1.resolve)(rootPath);
        const files = await this.walk(absoluteRoot);
        const manifestFiles = files
            .filter((file) => file.endsWith(".template.json"))
            .sort();
        const loaded = [];
        const skippedFiles = files.filter((file) => !file.endsWith(".template.json"));
        const warnings = [];
        for (const manifestFile of manifestFiles) {
            try {
                loaded.push(await this.loadManifest(manifestFile, {
                    replaceRoot: absoluteRoot,
                }));
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : String(error);
                warnings.push(`${manifestFile}: ${message}`);
            }
        }
        return {
            rootPath: absoluteRoot,
            loaded,
            skippedFiles,
            warnings,
            loadedAt: new Date().toISOString(),
        };
    }
    validateManifest(value, manifestPath) {
        if (!value ||
            typeof value !== "object" ||
            Array.isArray(value)) {
            throw new codegen_errors_1.CodeGenValidationError(`Template manifest must be a JSON object: ${manifestPath}`);
        }
        const record = value;
        const requiredStrings = [
            "key",
            "name",
            "targetPath",
            "templateFile",
        ];
        for (const key of requiredStrings) {
            if (typeof record[key] !==
                "string" ||
                !record[key]
                    .trim()) {
                throw new codegen_errors_1.CodeGenValidationError(`Template manifest property is required: ${key} in ${manifestPath}`);
            }
        }
        if (!record["version"] ||
            typeof record["version"] !==
                "object" ||
            Array.isArray(record["version"])) {
            throw new codegen_errors_1.CodeGenValidationError(`Template manifest version is required: ${manifestPath}`);
        }
        return value;
    }
    async walk(directory) {
        const entries = await (0, promises_1.readdir)(directory, {
            withFileTypes: true,
        });
        const files = [];
        for (const entry of entries) {
            const absolutePath = (0, node_path_1.join)(directory, entry.name);
            if (entry.isDirectory()) {
                files.push(...await this.walk(absolutePath));
            }
            else if (entry.isFile()) {
                files.push(absolutePath);
            }
        }
        return files;
    }
}
exports.CodeGenTemplateLoader = CodeGenTemplateLoader;
//# sourceMappingURL=codegen-template-loader.js.map