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
var DependencyHealthRegistryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyHealthRegistryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const dependency_status_enum_1 = require("../enums/dependency-status.enum");
const with_timeout_util_1 = require("../utils/with-timeout.util");
let DependencyHealthRegistryService = DependencyHealthRegistryService_1 = class DependencyHealthRegistryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DependencyHealthRegistryService_1.name);
        this.checks = new Map();
    }
    onModuleInit() {
        this.register({
            name: "database",
            critical: true,
            timeoutMs: 3_000,
            executor: async () => {
                await this.prisma.$queryRawUnsafe("SELECT 1");
                return {
                    name: "database",
                    status: dependency_status_enum_1.DependencyStatus.HEALTHY,
                    critical: true,
                    message: "Database connection is operational",
                };
            },
        });
        this.register({
            name: "runtime-memory",
            critical: true,
            timeoutMs: 1_000,
            executor: async () => {
                const memory = process.memoryUsage();
                const heapUsagePercent = memory.heapTotal > 0
                    ? (memory.heapUsed / memory.heapTotal) * 100
                    : 0;
                let status = dependency_status_enum_1.DependencyStatus.HEALTHY;
                let message = "Runtime memory usage is within limits";
                if (heapUsagePercent >= 95) {
                    status = dependency_status_enum_1.DependencyStatus.UNHEALTHY;
                    message = "Runtime heap usage is critically high";
                }
                else if (heapUsagePercent >= 85) {
                    status = dependency_status_enum_1.DependencyStatus.DEGRADED;
                    message = "Runtime heap usage is elevated";
                }
                return {
                    name: "runtime-memory",
                    status,
                    critical: true,
                    message,
                    metadata: {
                        heapUsedBytes: memory.heapUsed,
                        heapTotalBytes: memory.heapTotal,
                        heapUsagePercent: Number(heapUsagePercent.toFixed(2)),
                        rssBytes: memory.rss,
                    },
                };
            },
        });
        this.register({
            name: "event-loop",
            critical: false,
            timeoutMs: 2_000,
            executor: async () => {
                const startedAt = process.hrtime.bigint();
                await new Promise((resolve) => {
                    setImmediate(resolve);
                });
                const elapsedNanoseconds = process.hrtime.bigint() - startedAt;
                const delayMs = Number(elapsedNanoseconds) / 1_000_000;
                const status = delayMs >= 250
                    ? dependency_status_enum_1.DependencyStatus.DEGRADED
                    : dependency_status_enum_1.DependencyStatus.HEALTHY;
                return {
                    name: "event-loop",
                    status,
                    critical: false,
                    message: status === dependency_status_enum_1.DependencyStatus.HEALTHY
                        ? "Event loop response is healthy"
                        : "Event loop response is delayed",
                    metadata: {
                        sampledDelayMs: Number(delayMs.toFixed(3)),
                        degradedThresholdMs: 250,
                    },
                };
            },
        });
    }
    register(configuration) {
        const name = configuration.name.trim().toLowerCase();
        if (!name) {
            throw new Error("Dependency check name is required");
        }
        this.checks.set(name, {
            name,
            critical: configuration.critical,
            timeoutMs: configuration.timeoutMs ?? 5_000,
            executor: configuration.executor,
        });
    }
    unregister(name) {
        return this.checks.delete(name.trim().toLowerCase());
    }
    listRegisteredChecks() {
        return Array.from(this.checks.values())
            .map((check) => ({
            name: check.name,
            critical: check.critical,
            timeoutMs: check.timeoutMs,
        }))
            .sort((left, right) => left.name.localeCompare(right.name));
    }
    async runAll() {
        const checks = Array.from(this.checks.values());
        const results = await Promise.all(checks.map((check) => this.executeCheck(check)));
        return results.sort((left, right) => left.name.localeCompare(right.name));
    }
    async runOne(name) {
        const check = this.checks.get(name.trim().toLowerCase());
        if (!check) {
            return null;
        }
        return this.executeCheck(check);
    }
    async executeCheck(check) {
        const startedAt = process.hrtime.bigint();
        try {
            const result = await (0, with_timeout_util_1.withTimeout)(check.executor(), check.timeoutMs, `dependency-check:${check.name}`);
            return {
                ...result,
                name: check.name,
                critical: check.critical,
                latencyMs: this.elapsedMilliseconds(startedAt),
                checkedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Unknown dependency health-check failure";
            this.logger.error(`Dependency check ${check.name} failed: ${message}`);
            return {
                name: check.name,
                status: dependency_status_enum_1.DependencyStatus.UNHEALTHY,
                critical: check.critical,
                latencyMs: this.elapsedMilliseconds(startedAt),
                checkedAt: new Date().toISOString(),
                message,
            };
        }
    }
    elapsedMilliseconds(startedAt) {
        const elapsedNanoseconds = process.hrtime.bigint() - startedAt;
        return Number((Number(elapsedNanoseconds) / 1_000_000).toFixed(3));
    }
};
exports.DependencyHealthRegistryService = DependencyHealthRegistryService;
exports.DependencyHealthRegistryService = DependencyHealthRegistryService = DependencyHealthRegistryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DependencyHealthRegistryService);
//# sourceMappingURL=dependency-health-registry.service.js.map