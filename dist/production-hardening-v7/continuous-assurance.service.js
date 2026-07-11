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
var ContinuousAssuranceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContinuousAssuranceService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const path = require("node:path");
const assurance_storage_service_1 = require("./assurance-storage.service");
let ContinuousAssuranceService = ContinuousAssuranceService_1 = class ContinuousAssuranceService {
    constructor(storage) {
        this.storage = storage;
        this.logger = new common_1.Logger(ContinuousAssuranceService_1.name);
        this.controlsCollection = "controls";
        this.runsCollection = "assurance-runs";
    }
    async seedDefaultControls() {
        const existing = await this.storage.readCollection(this.controlsCollection);
        const defaults = [
            {
                controlCode: "AVOS-ASSURANCE-001",
                name: "Persistent audit storage",
                description: "Validates that the persistent audit storage directory is available.",
                framework: "AVOS Enterprise Control Framework",
                category: "audit",
                severity: "critical",
                enabled: true,
                validationType: "storage_directory",
                expectedValue: true,
                metadata: {
                    path: "storage",
                },
            },
            {
                controlCode: "AVOS-ASSURANCE-002",
                name: "Production hardening V6 source availability",
                description: "Validates that the V6 hardening module source directory exists.",
                framework: "AVOS Enterprise Control Framework",
                category: "platform-integrity",
                severity: "high",
                enabled: true,
                validationType: "source_path",
                expectedValue: true,
                metadata: {
                    path: "src/production-hardening-v6",
                    alternativePaths: [
                        "src/platform-hardening",
                        "src/production-hardening",
                    ],
                },
            },
            {
                controlCode: "AVOS-ASSURANCE-003",
                name: "Environment configuration",
                description: "Validates that the API environment file is present.",
                framework: "AVOS Enterprise Control Framework",
                category: "configuration",
                severity: "high",
                enabled: true,
                validationType: "file_exists",
                expectedValue: true,
                metadata: {
                    path: ".env",
                },
            },
            {
                controlCode: "AVOS-ASSURANCE-004",
                name: "Prisma schema availability",
                description: "Validates that the canonical Prisma schema exists.",
                framework: "AVOS Enterprise Control Framework",
                category: "data-governance",
                severity: "critical",
                enabled: true,
                validationType: "file_exists",
                expectedValue: true,
                metadata: {
                    path: "prisma/schema.prisma",
                },
            },
            {
                controlCode: "AVOS-ASSURANCE-005",
                name: "Package lock integrity surface",
                description: "Validates that a supported package lock file is present.",
                framework: "AVOS Enterprise Control Framework",
                category: "supply-chain",
                severity: "high",
                enabled: true,
                validationType: "any_file_exists",
                expectedValue: true,
                metadata: {
                    paths: [
                        "pnpm-lock.yaml",
                        "../../pnpm-lock.yaml",
                        "package-lock.json",
                        "yarn.lock",
                    ],
                },
            },
            {
                controlCode: "AVOS-ASSURANCE-006",
                name: "V7 persistent assurance storage",
                description: "Validates that V7 assurance storage is writable.",
                framework: "AVOS Enterprise Control Framework",
                category: "continuous-assurance",
                severity: "critical",
                enabled: true,
                validationType: "storage_writable",
                expectedValue: true,
                metadata: {
                    path: "storage/production-hardening-v7",
                },
            },
        ];
        let created = 0;
        for (const candidate of defaults) {
            const alreadyExists = existing.some((control) => control.controlCode === candidate.controlCode);
            if (alreadyExists) {
                continue;
            }
            const now = new Date().toISOString();
            existing.push({
                ...candidate,
                id: (0, node_crypto_1.randomUUID)(),
                createdAt: now,
                updatedAt: now,
            });
            created += 1;
        }
        await this.storage.writeCollection(this.controlsCollection, existing);
        return {
            created,
            total: existing.length,
        };
    }
    async createControl(dto) {
        const controls = await this.storage.readCollection(this.controlsCollection);
        const duplicate = controls.find((control) => control.controlCode === dto.controlCode);
        if (duplicate) {
            throw new Error(`Control code ${dto.controlCode} already exists`);
        }
        const now = new Date().toISOString();
        const control = {
            id: (0, node_crypto_1.randomUUID)(),
            controlCode: dto.controlCode,
            name: dto.name,
            description: dto.description,
            framework: dto.framework,
            category: dto.category,
            severity: dto.severity,
            enabled: dto.enabled ?? true,
            validationType: dto.validationType,
            expectedValue: dto.expectedValue,
            metadata: dto.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        controls.push(control);
        await this.storage.writeCollection(this.controlsCollection, controls);
        return control;
    }
    async listControls() {
        return this.storage.readCollection(this.controlsCollection);
    }
    async getControl(id) {
        const control = await this.storage.findById(this.controlsCollection, id);
        if (!control) {
            throw new common_1.NotFoundException(`Assurance control ${id} was not found`);
        }
        return control;
    }
    async runAssurance(trigger = "manual") {
        const startedAt = new Date();
        const runId = (0, node_crypto_1.randomUUID)();
        const controls = (await this.storage.readCollection(this.controlsCollection)).filter((control) => control.enabled);
        const results = [];
        for (const control of controls) {
            results.push(await this.validateControl(runId, control));
        }
        const passedControls = results.filter((result) => result.status === "passed").length;
        const warningControls = results.filter((result) => result.status === "warning").length;
        const failedControls = results.filter((result) => result.status === "failed").length;
        const totalControls = results.length;
        const score = totalControls === 0
            ? 100
            : Math.max(0, Math.round(((passedControls + warningControls * 0.5) /
                totalControls) *
                100));
        const status = this.resolveAssuranceStatus(score, failedControls, results);
        const completedAt = new Date();
        const now = completedAt.toISOString();
        const run = {
            id: runId,
            status,
            startedAt: startedAt.toISOString(),
            completedAt: now,
            totalControls,
            passedControls,
            warningControls,
            failedControls,
            score,
            results,
            trigger,
            createdAt: now,
            updatedAt: now,
        };
        await this.storage.append(this.runsCollection, run);
        this.logger.log(`Assurance run ${run.id} completed with status=${status}, score=${score}`);
        return run;
    }
    async listRuns() {
        const runs = await this.storage.readCollection(this.runsCollection);
        return runs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    async getLatestRun() {
        const runs = await this.listRuns();
        return runs[0] ?? null;
    }
    async validateControl(runId, control) {
        const started = Date.now();
        let status = "warning";
        let observedValue = null;
        let message = "Validation type is not implemented";
        const evidenceReferences = [];
        try {
            switch (control.validationType) {
                case "file_exists": {
                    const configuredPath = String(control.metadata.path ?? "");
                    const exists = await this.pathExists(configuredPath);
                    observedValue = exists;
                    status = exists ? "passed" : "failed";
                    message = exists
                        ? `Required file exists: ${configuredPath}`
                        : `Required file is missing: ${configuredPath}`;
                    evidenceReferences.push(configuredPath);
                    break;
                }
                case "any_file_exists": {
                    const paths = Array.isArray(control.metadata.paths)
                        ? control.metadata.paths.map(String)
                        : [];
                    const checks = await Promise.all(paths.map(async (candidatePath) => ({
                        path: candidatePath,
                        exists: await this.pathExists(candidatePath),
                    })));
                    const existingPath = checks.find((check) => check.exists);
                    observedValue = checks;
                    status = existingPath ? "passed" : "failed";
                    message = existingPath
                        ? `At least one required file exists: ${existingPath.path}`
                        : "None of the configured files exist";
                    evidenceReferences.push(...paths);
                    break;
                }
                case "source_path": {
                    const primaryPath = String(control.metadata.path ?? "");
                    const alternativePaths = Array.isArray(control.metadata.alternativePaths)
                        ? control.metadata.alternativePaths.map(String)
                        : [];
                    const candidates = [
                        primaryPath,
                        ...alternativePaths,
                    ].filter(Boolean);
                    const checks = await Promise.all(candidates.map(async (candidatePath) => ({
                        path: candidatePath,
                        exists: await this.pathExists(candidatePath),
                    })));
                    const existingPath = checks.find((check) => check.exists);
                    observedValue = checks;
                    status = existingPath ? "passed" : "warning";
                    message = existingPath
                        ? `Hardening source found: ${existingPath.path}`
                        : "No known V6 source directory name was found";
                    evidenceReferences.push(...candidates);
                    break;
                }
                case "storage_directory": {
                    const configuredPath = String(control.metadata.path ?? "storage");
                    const absolutePath = path.resolve(process.cwd(), configuredPath);
                    await node_fs_1.promises.mkdir(absolutePath, {
                        recursive: true,
                    });
                    const stats = await node_fs_1.promises.stat(absolutePath);
                    observedValue = stats.isDirectory();
                    status = stats.isDirectory()
                        ? "passed"
                        : "failed";
                    message = stats.isDirectory()
                        ? `Storage directory is available: ${configuredPath}`
                        : `Storage path is not a directory: ${configuredPath}`;
                    evidenceReferences.push(configuredPath);
                    break;
                }
                case "storage_writable": {
                    const configuredPath = String(control.metadata.path ??
                        "storage/production-hardening-v7");
                    const absolutePath = path.resolve(process.cwd(), configuredPath);
                    await node_fs_1.promises.mkdir(absolutePath, {
                        recursive: true,
                    });
                    const probePath = path.join(absolutePath, `.write-probe-${process.pid}-${Date.now()}`);
                    await node_fs_1.promises.writeFile(probePath, "AVOS_ASSURANCE_WRITE_PROBE", "utf8");
                    await node_fs_1.promises.unlink(probePath);
                    observedValue = true;
                    status = "passed";
                    message = `Storage is writable: ${configuredPath}`;
                    evidenceReferences.push(configuredPath);
                    break;
                }
                default: {
                    status = "warning";
                    observedValue = null;
                    message =
                        `Unknown validation type: ${control.validationType}`;
                }
            }
        }
        catch (error) {
            status = "failed";
            observedValue = false;
            message =
                error instanceof Error
                    ? error.message
                    : "Unknown validation error";
        }
        const now = new Date().toISOString();
        return {
            id: (0, node_crypto_1.randomUUID)(),
            runId,
            controlId: control.id,
            controlCode: control.controlCode,
            status,
            observedValue,
            expectedValue: control.expectedValue,
            message,
            evidenceReferences,
            durationMs: Date.now() - started,
            createdAt: now,
            updatedAt: now,
        };
    }
    resolveAssuranceStatus(score, failedControls, results) {
        const hasCriticalFailure = results.some((result) => result.status === "failed" &&
            this.isCriticalControl(result.controlId));
        if (hasCriticalFailure || score < 50) {
            return "critical";
        }
        if (failedControls > 0 || score < 75) {
            return "degraded";
        }
        if (score < 95) {
            return "warning";
        }
        return "healthy";
    }
    isCriticalControl(_controlId) {
        return false;
    }
    async pathExists(configuredPath) {
        if (!configuredPath) {
            return false;
        }
        try {
            await node_fs_1.promises.access(path.resolve(process.cwd(), configuredPath));
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.ContinuousAssuranceService = ContinuousAssuranceService;
exports.ContinuousAssuranceService = ContinuousAssuranceService = ContinuousAssuranceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService])
], ContinuousAssuranceService);
//# sourceMappingURL=continuous-assurance.service.js.map