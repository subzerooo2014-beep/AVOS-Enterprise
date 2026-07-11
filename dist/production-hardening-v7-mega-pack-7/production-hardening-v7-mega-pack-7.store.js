"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductionHardeningV7MegaPack7Store_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack7Store = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const path = require("node:path");
let ProductionHardeningV7MegaPack7Store = ProductionHardeningV7MegaPack7Store_1 = class ProductionHardeningV7MegaPack7Store {
    constructor() {
        this.logger = new common_1.Logger(ProductionHardeningV7MegaPack7Store_1.name);
        this.storageDirectory = path.resolve(process.cwd(), "runtime-data");
        this.storageFile = path.join(this.storageDirectory, "production-hardening-v7-mega-pack-7.json");
        this.state = this.createInitialState();
        this.writeQueue = Promise.resolve();
        this.readyPromise = new Promise((resolve) => {
            this.resolveReady = resolve;
        });
    }
    async onModuleInit() {
        try {
            await this.load();
        }
        finally {
            this.resolveReady();
        }
    }
    async waitUntilReady() {
        await this.readyPromise;
    }
    getSnapshot() {
        return structuredClone(this.state);
    }
    async mutate(mutator) {
        await mutator(this.state);
        this.state.updatedAt = new Date().toISOString();
        await this.persist();
        return this.getSnapshot();
    }
    async appendEvent(event) {
        const created = {
            id: (0, node_crypto_1.randomUUID)(),
            createdAt: new Date().toISOString(),
            ...event,
        };
        await this.mutate((state) => {
            state.events.push(created);
            if (state.events.length > 5000) {
                state.events = state.events.slice(-5000);
            }
        });
        return created;
    }
    async appendEvidence(params) {
        const previous = this.state.evidence.length > 0
            ? this.state.evidence[this.state.evidence.length - 1]
            : null;
        const payloadHash = this.hash(this.stableStringify(params.payload));
        const createdAt = new Date().toISOString();
        const chainHash = this.hash([
            previous?.chainHash ?? "GENESIS",
            params.evidenceType,
            params.entityType,
            params.entityId,
            payloadHash,
            createdAt,
        ].join("|"));
        const evidence = {
            id: (0, node_crypto_1.randomUUID)(),
            evidenceType: params.evidenceType,
            entityType: params.entityType,
            entityId: params.entityId,
            payloadHash,
            previousHash: previous?.chainHash ?? null,
            chainHash,
            verified: true,
            createdAt,
        };
        await this.mutate((state) => {
            state.evidence.push(evidence);
            if (state.evidence.length > 10000) {
                state.evidence = state.evidence.slice(-10000);
            }
        });
        return evidence;
    }
    verifyEvidenceChain() {
        let previousHash = null;
        for (const evidence of this.state.evidence) {
            if (evidence.previousHash !== previousHash) {
                return {
                    verified: false,
                    checked: this.state.evidence.length,
                    brokenAt: evidence.id,
                };
            }
            previousHash = evidence.chainHash;
        }
        return {
            verified: true,
            checked: this.state.evidence.length,
            brokenAt: null,
        };
    }
    async load() {
        await node_fs_1.promises.mkdir(this.storageDirectory, {
            recursive: true,
        });
        try {
            const raw = await node_fs_1.promises.readFile(this.storageFile, "utf8");
            const parsed = JSON.parse(raw);
            this.state = this.normalizeState(parsed);
            this.logger.log(`Persistent resilience state loaded: ${this.storageFile}`);
        }
        catch (error) {
            const nodeError = error;
            if (nodeError.code !== "ENOENT") {
                this.logger.warn(`Unable to load resilience state. Creating a new state: ${nodeError.message}`);
            }
            this.state = this.createInitialState();
            await this.persist();
            this.logger.log(`Persistent resilience state initialized: ${this.storageFile}`);
        }
    }
    async persist() {
        const snapshot = JSON.stringify(this.state, null, 2);
        const temporaryFile = `${this.storageFile}.tmp`;
        this.writeQueue = this.writeQueue.then(async () => {
            await node_fs_1.promises.mkdir(this.storageDirectory, {
                recursive: true,
            });
            await node_fs_1.promises.writeFile(temporaryFile, snapshot, "utf8");
            await node_fs_1.promises.rename(temporaryFile, this.storageFile);
        });
        await this.writeQueue;
    }
    createInitialState() {
        const now = new Date().toISOString();
        return {
            version: "v7-mega-pack-7",
            initializedAt: now,
            updatedAt: now,
            slos: [],
            signals: [],
            errorBudgets: [],
            incidents: [],
            releaseCandidates: [],
            releaseEvaluations: [],
            continuityPlans: [],
            chaosDrills: [],
            evidence: [],
            events: [],
        };
    }
    normalizeState(input) {
        const initial = this.createInitialState();
        return {
            ...initial,
            ...input,
            slos: Array.isArray(input.slos)
                ? input.slos
                : [],
            signals: Array.isArray(input.signals)
                ? input.signals
                : [],
            errorBudgets: Array.isArray(input.errorBudgets)
                ? input.errorBudgets
                : [],
            incidents: Array.isArray(input.incidents)
                ? input.incidents
                : [],
            releaseCandidates: Array.isArray(input.releaseCandidates)
                ? input.releaseCandidates
                : [],
            releaseEvaluations: Array.isArray(input.releaseEvaluations)
                ? input.releaseEvaluations
                : [],
            continuityPlans: Array.isArray(input.continuityPlans)
                ? input.continuityPlans
                : [],
            chaosDrills: Array.isArray(input.chaosDrills)
                ? input.chaosDrills
                : [],
            evidence: Array.isArray(input.evidence)
                ? input.evidence
                : [],
            events: Array.isArray(input.events)
                ? input.events
                : [],
        };
    }
    hash(value) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(value)
            .digest("hex");
    }
    stableStringify(value) {
        const normalize = (item) => {
            if (Array.isArray(item)) {
                return item.map(normalize);
            }
            if (item &&
                typeof item === "object" &&
                !(item instanceof Date)) {
                return Object.fromEntries(Object.entries(item)
                    .sort(([left], [right]) => left.localeCompare(right))
                    .map(([key, nestedValue]) => [
                    key,
                    normalize(nestedValue),
                ]));
            }
            return item;
        };
        return JSON.stringify(normalize(value));
    }
};
exports.ProductionHardeningV7MegaPack7Store = ProductionHardeningV7MegaPack7Store;
exports.ProductionHardeningV7MegaPack7Store = ProductionHardeningV7MegaPack7Store = ProductionHardeningV7MegaPack7Store_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductionHardeningV7MegaPack7Store);
//# sourceMappingURL=production-hardening-v7-mega-pack-7.store.js.map