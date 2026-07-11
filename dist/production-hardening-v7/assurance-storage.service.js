"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AssuranceStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssuranceStorageService = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const path = require("node:path");
let AssuranceStorageService = AssuranceStorageService_1 = class AssuranceStorageService {
    constructor() {
        this.logger = new common_1.Logger(AssuranceStorageService_1.name);
        this.storageDirectory = path.resolve(process.cwd(), "storage", "production-hardening-v7");
    }
    async onModuleInit() {
        await this.ensureStorageDirectory();
    }
    async readCollection(collection) {
        await this.ensureStorageDirectory();
        const filePath = this.getCollectionPath(collection);
        try {
            const raw = await node_fs_1.promises.readFile(filePath, "utf8");
            const normalized = this.normalizeJsonContent(raw);
            if (!normalized) {
                await this.writeCollection(collection, []);
                return [];
            }
            const parsed = JSON.parse(normalized);
            if (!Array.isArray(parsed)) {
                this.logger.warn(`Collection ${collection} did not contain an array. Resetting to an empty collection.`);
                await this.writeCollection(collection, []);
                return [];
            }
            return parsed;
        }
        catch (error) {
            if (this.isMissingFileError(error)) {
                await this.writeCollection(collection, []);
                return [];
            }
            if (error instanceof SyntaxError) {
                this.logger.error(`Invalid JSON detected in collection ${collection}. A backup will be created and the collection will be reset.`);
                await this.backupCorruptedCollection(collection, filePath);
                await this.writeCollection(collection, []);
                return [];
            }
            throw error;
        }
    }
    async writeCollection(collection, records) {
        await this.ensureStorageDirectory();
        const destination = this.getCollectionPath(collection);
        const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`;
        const payload = JSON.stringify(records, null, 2);
        await node_fs_1.promises.writeFile(temporary, payload, {
            encoding: "utf8",
        });
        await node_fs_1.promises.rename(temporary, destination);
    }
    async append(collection, record) {
        const records = await this.readCollection(collection);
        records.push(record);
        await this.writeCollection(collection, records);
        return record;
    }
    async replaceById(collection, id, replacement) {
        const records = await this.readCollection(collection);
        const index = records.findIndex((record) => record.id === id);
        if (index < 0) {
            return null;
        }
        records[index] = replacement;
        await this.writeCollection(collection, records);
        return replacement;
    }
    async findById(collection, id) {
        const records = await this.readCollection(collection);
        return (records.find((record) => record.id === id) ?? null);
    }
    async removeById(collection, id) {
        const records = await this.readCollection(collection);
        const filtered = records.filter((record) => record.id !== id);
        if (records.length === filtered.length) {
            return false;
        }
        await this.writeCollection(collection, filtered);
        return true;
    }
    async collectionCount(collection) {
        const records = await this.readCollection(collection);
        return records.length;
    }
    normalizeJsonContent(raw) {
        return raw
            .replace(/^\uFEFF/, "")
            .replace(/^\uFFFE/, "")
            .trim();
    }
    async ensureStorageDirectory() {
        await node_fs_1.promises.mkdir(this.storageDirectory, {
            recursive: true,
        });
    }
    getCollectionPath(collection) {
        const safeCollection = collection.replace(/[^a-zA-Z0-9-_]/g, "_");
        return path.join(this.storageDirectory, `${safeCollection}.json`);
    }
    async backupCorruptedCollection(collection, filePath) {
        try {
            const backupPath = path.join(this.storageDirectory, `${collection}.corrupted.${Date.now()}.json`);
            await node_fs_1.promises.copyFile(filePath, backupPath);
        }
        catch (error) {
            this.logger.error(`Could not create backup for collection ${collection}`, error instanceof Error
                ? error.stack
                : String(error));
        }
    }
    isMissingFileError(error) {
        return (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code ===
                "ENOENT");
    }
};
exports.AssuranceStorageService = AssuranceStorageService;
exports.AssuranceStorageService = AssuranceStorageService = AssuranceStorageService_1 = __decorate([
    (0, common_1.Injectable)()
], AssuranceStorageService);
//# sourceMappingURL=assurance-storage.service.js.map