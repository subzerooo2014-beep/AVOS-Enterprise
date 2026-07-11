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
var PublisherDispatcherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherDispatcherService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_action_log_service_1 = require("../ai-action-log/ai-action-log.service");
const publisher_registry_service_1 = require("./publisher-registry.service");
const publisher_dispatch_core_service_1 = require("./services/publisher-dispatch-core.service");
const publisher_retry_policy_service_1 = require("./services/publisher-retry-policy.service");
const publisher_circuit_breaker_service_1 = require("./services/publisher-circuit-breaker.service");
const publisher_runtime_metrics_service_1 = require("./services/publisher-runtime-metrics.service");
const publisher_dead_letter_service_1 = require("./services/publisher-dead-letter.service");
const publisher_job_reservation_service_1 = require("./services/publisher-job-reservation.service");
let PublisherDispatcherService = PublisherDispatcherService_1 = class PublisherDispatcherService {
    constructor(prisma, aiActionLog, registry, moduleRef, retryPolicy, circuitBreaker, runtimeMetrics, deadLetter, reservation) {
        this.prisma = prisma;
        this.aiActionLog = aiActionLog;
        this.registry = registry;
        this.moduleRef = moduleRef;
        this.retryPolicy = retryPolicy;
        this.circuitBreaker = circuitBreaker;
        this.runtimeMetrics = runtimeMetrics;
        this.deadLetter = deadLetter;
        this.reservation = reservation;
        this.logger = new common_1.Logger(PublisherDispatcherService_1.name);
        this.workerId = process.env.PUBLISHER_WORKER_ID?.trim() ||
            `publisher-worker-${process.pid}-${(0, node_crypto_1.randomUUID)().slice(0, 8)}`;
        this.concurrency = this.readPositiveInteger(process.env.PUBLISHER_WORKER_CONCURRENCY, 5);
        this.defaultQueueLimit = this.readPositiveInteger(process.env.PUBLISHER_QUEUE_LIMIT, 20);
        this.maximumQueueLimit = this.readPositiveInteger(process.env.PUBLISHER_MAX_QUEUE_LIMIT, 200);
        this.workerQueue = [];
        this.acceptingJobs = true;
        this.activeWorkers = 0;
        this.reservedCount = 0;
        this.dispatchedCount = 0;
        this.publishedCount = 0;
        this.failedCount = 0;
        this.retriedCount = 0;
        this.deadLetteredCount = 0;
    }
    async health() {
        const channels = await this.registry.health();
        return {
            success: this.acceptingJobs &&
                channels.every((item) => item.status !== "offline"),
            version: "v2",
            engine: "PublisherEngineV2",
            workerId: this.workerId,
            acceptingJobs: this.acceptingJobs,
            workerPool: {
                concurrency: this.concurrency,
                activeWorkers: this.activeWorkers,
                queuedWorkers: this.workerQueue.length,
            },
            counters: {
                reserved: this.reservedCount,
                dispatched: this.dispatchedCount,
                published: this.publishedCount,
                failed: this.failedCount,
                retried: this.retriedCount,
                deadLettered: this.deadLetteredCount,
            },
            channels,
            circuits: this.circuitBreaker.snapshot(),
            runtimeMetrics: this.runtimeMetrics.summary(),
            checkedAt: new Date(),
        };
    }
    async dispatchQueued(limit = this.defaultQueueLimit) {
        this.assertAcceptingJobs();
        const normalizedLimit = this.normalizeLimit(limit);
        const startedAt = new Date();
        await this.reservation.releaseExpired(this.readPositiveInteger(process.env.PUBLISHER_LOCK_TIMEOUT_MINUTES, 10));
        const reservationResult = await this.reservation.reserveBatch({
            workerId: this.workerId,
            limit: normalizedLimit,
        });
        const jobs = reservationResult.jobs;
        this.reservedCount += jobs.length;
        await Promise.all(jobs.map((job) => this.audit(job, "JOB_RESERVED", "reserved")));
        if (jobs.length === 0) {
            const finishedAt = new Date();
            return {
                success: true,
                workerId: this.workerId,
                requestedLimit: normalizedLimit,
                selected: 0,
                reserved: 0,
                published: 0,
                failed: 0,
                retrying: 0,
                deadLettered: 0,
                results: [],
                startedAt,
                finishedAt,
                durationMs: finishedAt.getTime() -
                    startedAt.getTime(),
            };
        }
        const settled = await Promise.allSettled(jobs.map((job) => this.enqueueWorker(() => this.executeWithResilience(job))));
        const results = settled.map((entry) => {
            if (entry.status === "fulfilled") {
                return entry.value;
            }
            return {
                success: false,
                status: "failed",
                error: {
                    message: this.errorMessage(entry.reason),
                },
            };
        });
        const published = results.filter((result) => this.extractStatus(result) === "published").length;
        const retrying = results.filter((result) => this.extractStatus(result) === "retrying").length;
        const deadLettered = results.filter((result) => this.extractStatus(result) === "dead").length;
        const failed = results.length -
            published -
            retrying;
        const finishedAt = new Date();
        return {
            success: failed === 0 &&
                deadLettered === 0,
            workerId: this.workerId,
            requestedLimit: normalizedLimit,
            selected: jobs.length,
            reserved: jobs.length,
            published,
            failed,
            retrying,
            deadLettered,
            results,
            startedAt,
            finishedAt,
            durationMs: finishedAt.getTime() -
                startedAt.getTime(),
        };
    }
    async dispatchOne(id) {
        this.assertAcceptingJobs();
        if (typeof id !== "string" || !id.trim()) {
            throw new Error("Publisher job id is required");
        }
        const reserved = await this.reservation.reserveOne(id.trim(), this.workerId);
        if (!reserved) {
            const current = await this.prisma.publishJob.findUnique({
                where: {
                    id: id.trim(),
                },
            });
            if (!current) {
                throw new Error(`Publisher job "${id}" was not found`);
            }
            throw new Error(`Publisher job "${id}" could not be reserved because it is already locked or is not dispatchable`);
        }
        this.reservedCount += 1;
        await this.audit(reserved, "JOB_RESERVED", "reserved");
        return this.enqueueWorker(() => this.executeWithResilience(reserved));
    }
    async onApplicationShutdown() {
        this.acceptingJobs = false;
        while (this.workerQueue.length > 0) {
            const task = this.workerQueue.shift();
            task?.reject(new Error("Publisher dispatcher stopped during application shutdown"));
        }
    }
    async executeWithResilience(job) {
        const channel = this.channelOf(job);
        if (!this.registry.exists(channel)) {
            this.failedCount += 1;
            this.deadLetteredCount += 1;
            this.runtimeMetrics.recordDeadLetter(channel);
            const error = new Error(`Publisher channel "${channel}" is not registered`);
            await this.audit(job, "JOB_FAILED", "failed");
            const deadResult = await this.deadLetter.move(job, error);
            await this.audit(job, "JOB_DEAD", "dead");
            return deadResult;
        }
        if (!this.circuitBreaker.canExecute(channel)) {
            this.failedCount += 1;
            await this.requeueJob(job, Number(job.retryCount ?? 0), "Publisher circuit is open");
            await this.audit(job, "JOB_RETRY", "retrying");
            return {
                success: false,
                status: "retrying",
                channel,
                jobId: job.id,
                message: "Publisher circuit is open; job returned to retry queue",
            };
        }
        const initialAttempt = this.retryPolicy.currentAttempt(job);
        const maximumAttempts = this.maxAttempts(job);
        let lastResult;
        let lastError;
        for (let attempt = initialAttempt; attempt <= maximumAttempts; attempt += 1) {
            const startedAt = Date.now();
            this.dispatchedCount += 1;
            this.runtimeMetrics.recordAttempt(channel);
            await this.audit(job, "JOB_STARTED", "processing");
            try {
                lastResult = await this.executeCore(job);
                const status = this.extractStatus(lastResult);
                if (status === "published" ||
                    status === "skipped") {
                    this.publishedCount += 1;
                    this.circuitBreaker.recordSuccess(channel);
                    this.runtimeMetrics.recordSuccess(channel, Date.now() - startedAt);
                    await this.audit(job, "JOB_SUCCESS", status);
                    return lastResult;
                }
                lastError = new Error(this.extractMessage(lastResult) ||
                    `Publisher returned status "${status}"`);
                this.circuitBreaker.recordFailure(channel);
                this.runtimeMetrics.recordFailure(channel, Date.now() - startedAt);
                const decision = this.retryPolicy.decide({
                    ...job,
                    maxAttempts: maximumAttempts,
                }, attempt, lastError, status);
                if (!decision.retry) {
                    break;
                }
                this.retriedCount += 1;
                this.runtimeMetrics.recordRetry(channel);
                await this.persistRetryState(job, attempt, this.errorMessage(lastError));
                await this.audit(job, "JOB_RETRY", "retrying");
                this.logger.warn(`Publisher retry: jobId=${job.id}, channel=${channel}, attempt=${attempt + 1}/${maximumAttempts}, delayMs=${decision.delayMs}`);
                await this.delay(decision.delayMs);
            }
            catch (error) {
                lastError = error;
                this.circuitBreaker.recordFailure(channel);
                this.runtimeMetrics.recordFailure(channel, Date.now() - startedAt);
                const decision = this.retryPolicy.decide({
                    ...job,
                    maxAttempts: maximumAttempts,
                }, attempt, error, "failed");
                if (!decision.retry) {
                    break;
                }
                this.retriedCount += 1;
                this.runtimeMetrics.recordRetry(channel);
                await this.persistRetryState(job, attempt, this.errorMessage(error));
                await this.audit(job, "JOB_RETRY", "retrying");
                this.logger.warn(`Publisher retry after exception: jobId=${job.id}, channel=${channel}, attempt=${attempt + 1}/${maximumAttempts}, delayMs=${decision.delayMs}, error=${this.errorMessage(error)}`);
                await this.delay(decision.delayMs);
            }
        }
        this.failedCount += 1;
        this.deadLetteredCount += 1;
        this.runtimeMetrics.recordDeadLetter(channel);
        await this.audit(job, "JOB_FAILED", "failed");
        const deadResult = await this.deadLetter.move(job, lastError ??
            new Error(this.extractMessage(lastResult) ||
                "Publisher attempts exhausted"));
        await this.audit(job, "JOB_DEAD", "dead");
        return deadResult;
    }
    async executeCore(job) {
        const core = this.moduleRef.get(publisher_dispatch_core_service_1.PublisherDispatchCoreService, {
            strict: false,
        });
        if (!core) {
            throw new Error("PublisherDispatchCoreService is not registered in PublisherEngineModule");
        }
        return core.dispatchOne(job);
    }
    async persistRetryState(job, attempt, lastError) {
        await this.prisma.publishJob.updateMany({
            where: {
                id: job.id,
                lockToken: job.lockToken,
                workerId: this.workerId,
            },
            data: {
                status: "retrying",
                retryCount: attempt,
                lastError: lastError.slice(0, 5000),
            },
        });
        job.retryCount = attempt;
        job.status = "retrying";
    }
    async requeueJob(job, attempt, lastError) {
        await this.prisma.publishJob.updateMany({
            where: {
                id: job.id,
                lockToken: job.lockToken,
                workerId: this.workerId,
            },
            data: {
                status: "retrying",
                retryCount: attempt,
                lastError: lastError.slice(0, 5000),
                workerId: null,
                lockToken: null,
                lockedAt: null,
            },
        });
        job.retryCount = attempt;
        job.status = "retrying";
        job.workerId = null;
        job.lockToken = null;
        job.lockedAt = null;
    }
    maxAttempts(job) {
        const maxRetries = Number(job?.maxRetries);
        if (Number.isInteger(maxRetries) &&
            maxRetries >= 0) {
            return maxRetries + 1;
        }
        return this.retryPolicy.maxAttempts(job);
    }
    enqueueWorker(execute) {
        this.assertAcceptingJobs();
        return new Promise((resolve, reject) => {
            this.workerQueue.push({
                execute,
                resolve,
                reject,
            });
            this.drainWorkerQueue();
        });
    }
    drainWorkerQueue() {
        while (this.acceptingJobs &&
            this.activeWorkers < this.concurrency &&
            this.workerQueue.length > 0) {
            const task = this.workerQueue.shift();
            if (!task) {
                return;
            }
            this.activeWorkers += 1;
            void task
                .execute()
                .then(task.resolve)
                .catch(task.reject)
                .finally(() => {
                this.activeWorkers -= 1;
                this.drainWorkerQueue();
            });
        }
    }
    channelOf(job) {
        return String(job?.channel ??
            job?.result?.channel ??
            job?.result?.publisher?.channel ??
            "internal")
            .trim()
            .toLowerCase();
    }
    normalizeLimit(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return this.defaultQueueLimit;
        }
        return Math.min(Math.max(Math.trunc(numeric), 1), this.maximumQueueLimit);
    }
    extractStatus(result) {
        const value = result?.status ??
            result?.result?.status ??
            result?.data?.status ??
            result?.job?.status;
        return typeof value === "string"
            ? value.toLowerCase()
            : "unknown";
    }
    extractMessage(result) {
        const value = result?.message ??
            result?.result?.message ??
            result?.error?.message;
        return typeof value === "string"
            ? value
            : "";
    }
    assertAcceptingJobs() {
        if (!this.acceptingJobs) {
            throw new Error("Publisher dispatcher is shutting down and no longer accepts jobs");
        }
    }
    delay(milliseconds) {
        if (milliseconds <= 0) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const timer = setTimeout(resolve, milliseconds);
            timer.unref?.();
        });
    }
    readPositiveInteger(value, fallback) {
        const numeric = Number(value);
        return Number.isInteger(numeric) &&
            numeric > 0
            ? numeric
            : fallback;
    }
    async audit(job, action, status) {
        const vehicleId = this.vehicleIdOf(job);
        if (!vehicleId) {
            return;
        }
        try {
            await this.aiActionLog.write(vehicleId, action, status);
        }
        catch (error) {
            this.logger.warn(`Publisher audit log failed: jobId=${String(job?.id ?? "unknown")}, vehicleId=${vehicleId}, action=${action}, error=${this.errorMessage(error)}`);
        }
    }
    vehicleIdOf(job) {
        const value = job?.result?.vehicleId ??
            job?.result?.metadata?.vehicleId ??
            job?.vehicleId ??
            null;
        if (typeof value !== "string" ||
            !value.trim()) {
            return null;
        }
        return value.trim();
    }
    errorMessage(error) {
        return error instanceof Error
            ? error.message
            : String(error ?? "Unknown publisher error");
    }
};
exports.PublisherDispatcherService = PublisherDispatcherService;
exports.PublisherDispatcherService = PublisherDispatcherService = PublisherDispatcherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_action_log_service_1.AiActionLogService,
        publisher_registry_service_1.PublisherRegistryService,
        core_1.ModuleRef,
        publisher_retry_policy_service_1.PublisherRetryPolicyService,
        publisher_circuit_breaker_service_1.PublisherCircuitBreakerService,
        publisher_runtime_metrics_service_1.PublisherRuntimeMetricsService,
        publisher_dead_letter_service_1.PublisherDeadLetterService,
        publisher_job_reservation_service_1.PublisherJobReservationService])
], PublisherDispatcherService);
//# sourceMappingURL=publisher-dispatcher.service.js.map