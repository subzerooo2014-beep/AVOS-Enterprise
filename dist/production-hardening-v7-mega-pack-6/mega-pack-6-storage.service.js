"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MegaPack6StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaPack6StorageService = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const path = require("node:path");
let MegaPack6StorageService = MegaPack6StorageService_1 = class MegaPack6StorageService {
    constructor() {
        this.logger = new common_1.Logger(MegaPack6StorageService_1.name);
        this.root = path.resolve(process.cwd(), "storage", "production-hardening-v7-mega-pack-6");
        this.writeQueue = Promise.resolve();
    }
    async onModuleInit() {
        await node_fs_1.promises.mkdir(this.root, {
            recursive: true,
        });
    }
    async readCollection(collection) {
        await node_fs_1.promises.mkdir(this.root, {
            recursive: true,
        });
        const filePath = this.collectionPath(collection);
        try {
            const raw = await node_fs_1.promises.readFile(filePath, "utf8");
            const normalized = raw
                .replace(/^\uFEFF/, "")
                .replace(/^\uFFFE/, "")
                .trim();
            if (!normalized) {
                await this.writeCollection(collection, []);
                return [];
            }
            const parsed = JSON.parse(normalized);
            if (!Array.isArray(parsed)) {
                await this.backupInvalidFile(collection, filePath);
                await this.writeCollection(collection, []);
                return [];
            }
            return parsed;
        }
        catch (error) {
            if (this.isMissingFile(error)) {
                await this.writeCollection(collection, []);
                return [];
            }
            if (error instanceof SyntaxError) {
                this.logger.error(`Invalid JSON in collection ${collection}. Resetting safely.`);
                await this.backupInvalidFile(collection, filePath);
                await this.writeCollection(collection, []);
                return [];
            }
            throw error;
        }
    }
    async writeCollection(collection, records) {
        this.writeQueue = this.writeQueue.then(async () => {
            await node_fs_1.promises.mkdir(this.root, {
                recursive: true,
            });
            const destination = this.collectionPath(collection);
            const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`;
            const payload = JSON.stringify(records, null, 2);
            await node_fs_1.promises.writeFile(temporary, payload, "utf8");
            try {
                await node_fs_1.promises.rename(temporary, destination);
            }
            catch {
                await node_fs_1.promises.copyFile(temporary, destination);
                await node_fs_1.promises.unlink(temporary);
            }
        });
        return this.writeQueue;
    }
    async append(collection, record) {
        const records = await this.readCollection(collection);
        records.push(record);
        await this.writeCollection(collection, records);
        return record;
    }
    async findById(collection, id) {
        const records = await this.readCollection(collection);
        return (records.find((record) => record.id === id) ?? null);
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
    async mutateCollection(collection, mutator) {
        const records = await this.readCollection(collection);
        const updated = await mutator(records);
        await this.writeCollection(collection, updated);
        return updated;
    }
    async count(collection) {
        const records = await this.readCollection(collection);
        return records.length;
    }
    async ensureCollections(collections) {
        for (const collection of collections) {
            const filePath = this.collectionPath(collection);
            try {
                await node_fs_1.promises.access(filePath);
            }
            catch {
                await this.writeCollection(collection, []);
            }
        }
    }
    collectionPath(collection) {
        const safe = collection.replace(/[^a-zA-Z0-9-_]/g, "_");
        return path.join(this.root, `${safe}.json`);
    }
    async backupInvalidFile(collection, filePath) {
        try {
            const backupPath = path.join(this.root, `${collection}.invalid.${Date.now()}.json`);
            await node_fs_1.promises.copyFile(filePath, backupPath);
        }
        catch (error) {
            this.logger.error(`Failed to backup invalid collection ${collection}`, error instanceof Error
                ? error.stack
                : String(error));
        }
    }
    isMissingFile(error) {
        return (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error
                .code === "ENOENT");
    }
};
exports.MegaPack6StorageService = MegaPack6StorageService;
exports.MegaPack6StorageService = MegaPack6StorageService = MegaPack6StorageService_1 = __decorate([
    (0, common_1.Injectable)()
], MegaPack6StorageService);
//# sourceMappingURL=mega-pack-6-storage.service.js.map